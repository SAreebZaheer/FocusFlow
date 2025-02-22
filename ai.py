from google import genai
from google.genai import types
from datetime import datetime

client = genai.Client(api_key="")

import PIL.Image

def getText(filename):
    filename = 'notes_images' + filename
    image = PIL.image.open(filename)
    
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=["What is written in the image?Your response should  only contain the contents of the image and nothing else.", image])
    text_name = "./UI/notes/" + str(datetime.now()) + ".txt"
    f = open(text_name, "a")
    f.write(response.text)
    f.close()
    return  text_name

def summarise(filename):
    response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=["Summarise the following text to 10 Lines:"])
    text_name = "./UI/notes/" + str(datetime.now()) + ".txt"
    f = open(text_name, "a")
    f.write(response.text)
    f.close()
    return  text_name
    