from google import genai
from google.genai import types
from datetime import datetime
import os

client = genai.Client(api_key="APIKEYHERE")

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
    
    heading = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=["Give an appropriate heading for the text below. Your response should only contain the heading and there should be no spaces or special characters involved. It can be in upper or lower case as per grammar rules: " + response.text]
    )
    # Remove any leading/trailing whitespace and newline characters from the heading
    fheading = heading.text.strip()
    # Construct the full path to the text file
    text_name = os.path.join("./UI/notes/", fheading +".txt")
    
    # Create and write to the text file
    with open(text_name, "w") as f:
        f.write(response.text)
    
    return text_name

def summarise(filename):
    # Open and read the input file
    with open(filename, "r") as f:
        file_text = f.read()

    # Generate a heading for the text
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=["Give an appropriate heading for the text below. Your response should only contain the heading and there should be no spaces or special characters involved. It can be in upper or lower case as per grammar rules: " + file_text]
    )
    
    # Remove any leading/trailing whitespace and newline characters from the heading
    heading = response.text.strip()

    # Construct the path for the summary file
    text_name = os.path.join("./UI/summaries/", heading + "_summarised.txt")

    # Generate a summary of the text
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=["Summarise the text below into 10 lines. Your response should only contain the summary: " + file_text]
    )

    # Write the summary to the file
    with open(text_name, "a") as f:
        f.write(response.text)

    return text_name

def transcribe(filename):
    filename = os.path.join('./UI/voice_recordings', filename)
    myfile = client.files.upload(file=filename)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=["Transcribe this audio. Your response should only have the text transcribed from the audio.", myfile]
    )
    
    heading = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=["Give a single heading for the text below. it will be used to name a file: " + response.text]
    )
    
    fheading = heading.text.strip()
    text_name = os.path.join("./UI/notes/", fheading + ".txt")
    
    with open(text_name, "a") as f:
        f.write(response.text)
        
    return text_name
