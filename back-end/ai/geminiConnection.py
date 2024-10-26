
import google.generativeai as genai

# Function calls the ai model and returns what is seen in the image
def image_analysis_call_alc(image):
    print("Analysis running")
    genai.configure(api_key="AIzaSyC7gKrKaJbpv9Tjn8d-4bQMUKCt9eOpin8")
    #print(f"{myfile=}")

    model = genai.GenerativeModel('gemini-1.5-pro')
    #response = model.generate_content("The opposite of hot is")
    #print(response.text)

    #response = model.generate_content(
    #[myfile, "\n\n", "Can you tell me what mocktails I can make using the bottles in the image?"])
    #print(f"{response.text=}")
    
    response = model.generate_content(["Return a list of all the alcohol bottles in the image. Return in format of bottle,type of alc,empty/not empty in json format","\n\n", image])
    
    return response

# Function calls the ai model and returns what is seen in the image
def image_analysis_call_nonalc(image):
    print("Analysis running")
    genai.configure(api_key="AIzaSyC7gKrKaJbpv9Tjn8d-4bQMUKCt9eOpin8")
    #print(f"{myfile=}")

    model = genai.GenerativeModel('gemini-1.5-pro')
    #response = model.generate_content("The opposite of hot is")
    #print(response.text)

    #response = model.generate_content(
    #[myfile, "\n\n", "Can you tell me what mocktails I can make using the bottles in the image?"])
    #print(f"{response.text=}")
    
    response = model.generate_content(["Return a list of all the drink bottles in the image. Return in format of bottle,type of alc,empty or not empty in json format","\n\n", image])
    print("Analysis finished")
    return response
