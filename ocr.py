from google import genai
from google.genai import types

import PIL.Image

image = PIL.Image.open('notes_images/images.png')

client = genai.Client(api_key="AIzaSyCPKQuDiibeF6Hud2ft3MyYOGMhMsuAOfQ")
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=["What is this image?", image])

print(response.text)