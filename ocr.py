from google import genai
from google.genai import types
from datetime import datetime

import PIL.Image

def getText(filename):
    filename = 'notes_images' + filename
    image = PIL.image.open(filename)
    image = PIL.Image.open(filename)
    client = genai.Client(api_key="AIzaSyCPKQuDiibeF6Hud2ft3MyYOGMhMsuAOfQ")
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=["What is written in the image?Your response should  only contain the contents of the image and nothing else.", image])
    text_name = "./notes/" + str(datetime.now()) + ".txt"
    f = open(text_name, "a")
    f.write(response.text)
    f.close()

getText("Areeb")