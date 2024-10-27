
import google.generativeai as genai

# Function calls the ai model and returns what is seen in the image
def image_analysis_call(image):
    print("Analysis running")
    genai.configure(api_key="AIzaSyC7gKrKaJbpv9Tjn8d-4bQMUKCt9eOpin8")
    #print(f"{myfile=}")

    model = genai.GenerativeModel('gemini-1.5-flash')
    #response = model.generate_content("The opposite of hot is")
    #print(response.text)

    #response = model.generate_content(
    #[myfile, "\n\n", "Can you tell me what mocktails I can make using the bottles in the image?"])
    #print(f"{response.text=}")
    
    prevMessage = model.generate_content(["Return a list of all the  drink bottles in the image. If non is detected return none","\n\n", image]).text
    response = model.generate_content([prevMessage,"Return a cocktail recipe from the given drinks. If not enough ingredients please say not enough ingredients","\n\n"])
    print("Analysis finished")
    return response
