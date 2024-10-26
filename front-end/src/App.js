import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';

function App() {
  const [photo, setPhoto] = useState(null);
  const [stream, setStream] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Cleanup function for camera stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      console.log('Requesting camera access...');

      // First check if media devices are available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported in this browser');
      }

      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      console.log('Getting user media with constraints:', constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted:', mediaStream);

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log('Stream set to video element');

        // Add loadedmetadata event listener
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, playing video');
          videoRef.current.play().catch(e => {
            console.error('Error playing video:', e);
          });
        };
      } else {
        console.error('Video ref is null');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError(err.message);
      setUploadStatus({
        type: 'error',
        message: `Camera access error: ${err.message}`
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      console.log('Stopping camera stream');
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.label);
      });
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref is null');
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Log video dimensions
      console.log('Video dimensions:', video.videoWidth, video.videoHeight);

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Photo taken successfully');

      setPhoto(photoData);
      stopCamera();
    } catch (err) {
      console.error('Error taking photo:', err);
      setError(err.message);
    }
  };

  const uploadPhoto = async () => {
    if (!photo) return;

    setIsUploading(true);
    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('photo', blob, 'photo.jpg');

      // Log the size of the photo being uploaded
      console.log('Uploading photo, size:', blob.size);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');

      setUploadStatus({
        type: 'success',
        message: 'Photo uploaded successfully!'
      });
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus({
        type: 'error',
        message: 'Failed to upload photo. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetApp = () => {
    setPhoto(null);
    setUploadStatus(null);
    setIsUploading(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">CockTAIL</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-4">
          {!photo ? (
            <>
              <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {stream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {stream ? (
                <Button
                  onClick={takePhoto}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Take Photo
                </Button>
              ) : (
                <Button
                  onClick={startCamera}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Start Camera
                </Button>
              )}
            </>
          ) : (
            <>
              <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={photo}
                  alt="Captured photo"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={resetApp}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={uploadPhoto}
                  disabled={isUploading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isUploading ? (
                    'Uploading...'
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {uploadStatus && (
            <Alert variant={uploadStatus.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription className="flex items-center">
                {uploadStatus.type === 'success' ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                {uploadStatus.message}
              </AlertDescription>
            </Alert>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}

export default App;