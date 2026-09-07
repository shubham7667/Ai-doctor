from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os 
import base64
from voice_recorder import text_to_speech
import pyttsx3
import re
load_dotenv()
# model initialization
llm = ChatGroq(
    model='qwen/qwen3.6-27b',
    api_key = os.getenv('GROQ_API_KEY'),
    temperature=0,
    max_tokens=300
)
# converting image to string
with open('image.png','rb') as image_file:
    base64image = base64.b64encode(image_file.read()).decode('utf-8')
text =text_to_speech()
message = HumanMessage(
    content=[
        {
           'type':'text',
           'text':text 
        },
        {
            'type': 'image_url',
            'image_url':{
                'url': f"data:image/jpeg;base64,{base64image}"
            }
        }
    ]
)
response = llm.invoke([message])
clean_text = re.sub(r'[^a-zA-Z0-9\s]', '', response.content)
engine = pyttsx3.init()
# for words per minute 
engine.setProperty('rate',150)
# volume 
engine.setProperty('volume',1.0)
engine.say(clean_text)
engine.runAndWait()
print(response.content)