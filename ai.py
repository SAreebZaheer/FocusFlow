from google import genai
from google.genai import types
from datetime import datetime

client = genai.Client(api_key="AIzaSyCPKQuDiibeF6Hud2ft3MyYOGMhMsuAOfQ")

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
    f = open(filename,"r")
    file_text = f.read()
    response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=["Give an appropriate heading for the text below. Your response should only contain the heading: "+ file_text])
    text_name = "./UI/summaries/" + response.text
    f = open(text_name, "a")
    response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=["Summarise the text below into 10 lines. Your response should only contain the summary: "+ file_text])
    f.write(response.text)
    f.close()
    return  text_name
    