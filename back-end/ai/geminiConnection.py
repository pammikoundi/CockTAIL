
import google.generativeai as genai

# Function calls the ai model and returns what is seen in the image
def image_analysis_call(image, content_type):

    genai.configure(api_key="AIzaSyC7gKrKaJbpv9Tjn8d-4bQMUKCt9eOpin8")
    #print(f"{myfile=}")

    model = genai.GenerativeModel('gemini-1.5-flash')
    #response = model.generate_content("The opposite of hot is")
    #print(response.text)

    #response = model.generate_content(
    #[myfile, "\n\n", "Can you tell me what mocktails I can make using the bottles in the image?"])
    #print(f"{response.text=}")

    response = model.generate_content(["Can you tell me what mocktails I can make using the bottles in the image?","\n\n", image])
    print(f"{response.text=}")
    
    return response
