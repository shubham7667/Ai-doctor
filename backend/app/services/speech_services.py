from fastapi import APIRouter,Depends
from app.core.config import GROQ_API_KEY
from groq import Groq

groq_api_key = GROQ_API_KEY

groq_client =Groq(
    api_key = groq_api_key
)

def transcribe_audio(audio_file, filename, content_type):
    transcription = groq_client.audio.transcriptions.create(
        file=(filename, audio_file, content_type),
        model='whisper-large-v3',
        language='en'
    )
    
    return transcription.text