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
  const [isCameraInitializing, setIsCameraInitializing] = useState(false);
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

  // Effect to handle video element initialization
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    if (isCameraInitializing) return; // Prevent multiple initialization attempts
    
    try {
      setError(null);
      setIsCameraInitializing(true);
      
      // Check for secure context
      if (!window.isSecureContext) {
        throw new Error('Camera access requires a secure context (HTTPS)');
      }

      // Check media devices support
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      // Try to get the rear camera first, fall back to any available camera
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!mediaStream.active) {
        throw new Error('Failed to activate camera stream');
      }

      setStream(mediaStream);
      
      // Wait for video to be ready
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => {
            setError(`Failed to start video playback: ${e.message}`);
          });
        };
        
        // Add error handler for video element
        videoRef.current.onerror = (e) => {
          setError(`Video playback error: ${e.target.error.message}`);
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = err.message;
      
      // Provide more user-friendly error messages
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access was denied. Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please ensure your device has a working camera.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      }
      
      setError(errorMessage);
      setUploadStatus({
        type: 'error',
        message: errorMessage
      });
      
      // Cleanup if there was an error
      stopCamera();
    } finally {
      setIsCameraInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      setError('Camera is not ready. Please try again.');
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Ensure video is actually playing and has valid dimensions
      if (video.readyState !== 4 || video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error('Video stream is not ready yet');
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      setPhoto(photoData);
      stopCamera();
    } catch (err) {
      setError(`Failed to capture photo: ${err.message}`);
    }
  };

  const uploadPhoto = async () => {
    if (!photo) return;

    setIsUploading(true);
    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      
      // Validate file size (e.g., max 10MB)
      if (blob.size > 10 * 1024 * 1024) {
        throw new Error('Photo size exceeds 10MB limit');
      }

      const formData = new FormData();
      formData.append('photo', blob, 'photo.jpg');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      setUploadStatus({
        type: 'success',
        message: 'Photo uploaded successfully!'
      });
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message: `Upload failed: ${err.message}`
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
              
              <Button 
                onClick={stream ? takePhoto : startCamera}
                disabled={isCameraInitializing}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300"
              >
                {isCameraInitializing ? (
                  'Initializing Camera...'
                ) : stream ? (
                  'Take Photo'
                ) : (
                  'Start Camera'
                )}
              </Button>
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