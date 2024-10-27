from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
from PIL import Image
from ai import geminiConnection

# Initialize Flask and CORS
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes by default

# Define the endpoint to receive data
@app.route('/upload/', methods=['POST'])
def receive_data():
    # Ensure a file is included in the request
    if 'source_file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    source_file = request.files['source_file']

    # Check if the uploaded file is an image
    if source_file.content_type and not source_file.content_type.startswith("image/"):
        return jsonify({'error': 'File type cannot be accepted'}), 400

    try:
        # Attempt to open the image
        image = Image.open(source_file)
        
        # Make an AI analysis call (assuming `geminiConnection` is defined and configured correctly)
        ai_response = geminiConnection.image_analysis_call(image).text

        # Process and clean AI response
        ai_response = ai_response.replace("`", "").replace("json", "")
        print(ai_response)
        
        return jsonify({'Response': ai_response})

    except Exception as e:
        # Catch any error in file processing or AI call
        print("Error:", e)
        return jsonify({'error': 'AI response was unable to be retrieved and processed.'}), 424

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
