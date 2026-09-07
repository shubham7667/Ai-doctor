import sounddevice as sd
from scipy.io.wavfile import write
from pydub import AudioSegment
import imageio_ffmpeg
from dotenv import load_dotenv

load_dotenv()

AudioSegment.converter = imageio_ffmpeg.get_ffmpeg_exe()

sample_rate = 16000
duration = 5

# record
print('recording started...')
audio = sd.rec(
    int(duration*sample_rate),
    samplerate=sample_rate,
    channels=1,
    dtype='int16'
)
sd.wait()

# save temporary wav
write('temp.wav',sample_rate,audio)

# convert wav to mp3
sound = AudioSegment.from_wav('temp.wav')
sound.export('../user_voice.mp3',format='mp3')
print('Audio saved.')

# converting speech to text
from groq import Groq
import os 
from langchain_groq import ChatGroq

groq_client = Groq(api_key = os.getenv('GROQ_API_KEY')) 

def text_to_speech():
    with open('../User_voice.mp3','rb')as user_file:
        transcription = groq_client.audio.transcriptions.create(
        file=user_file,                                               
        model='whisper-large-v3',
        language='en'
        )
    text = transcription.text
    return text
