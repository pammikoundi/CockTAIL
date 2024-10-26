import base64
import json

# Function to encode a local image into data URL 
def local_image_to_data_url(image, content_type):
    # Read and encode the image file
    base64_encoded_data = base64.b64encode(image).decode('utf-8')
    # Construct the data URL
    return f"data:{content_type};base64,{base64_encoded_data}"


# Function calls the ai model and returns what is seen in the image
def image_analysis_call(imagePath, content_type):

    response = ""
    return response
