from google import genai
from google.genai import types
from datetime import datetime
import os

client = genai.Client(api_key="AIzaSyCPKQuDiibeF6Hud2ft3MyYOGMhMsuAOfQ")

import PIL.Image

def getText(filename):
    # Construct the full path to the image file
    filename = os.path.join('./UI/notes_images', filename)
    
    # Open the image
    image = PIL.Image.open(filename)
    
    # Generate content using the model
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=["What is written in the image? Your response should only contain the contents of the image and nothing else.", image]
    )
    
    # Format the datetime to be filename-friendly
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    
    # Construct the full path to the text file
    text_name = os.path.join("./UI/notes/", f"{timestamp}.txt")
    
    # Create and write to the text file
    with open(text_name, "w") as f:
        f.write(response.text)
    
    return text_name

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
