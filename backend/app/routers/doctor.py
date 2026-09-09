import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.core.dependencies import get_current_user
from app.services.speech_services import transcribe_audio
from app.services.llm_services import ask_llm


router = APIRouter()
logger = logging.getLogger(__name__)


@router.post('/query')
async def query(
    image: UploadFile = File(...),
    audio: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    # Check files
    if not image.filename or not audio.filename:
        raise HTTPException(
            status_code=400,
            detail='Both image and audio files are required.'
        )

    # -------------------------
    # AUDIO → TEXT
    # -------------------------

    audio_bytes = await audio.read()

    if not audio_bytes:
        raise HTTPException(
            status_code=400,
            detail='The audio recording is empty.'
        )

    try:
        text = transcribe_audio(
            audio_bytes,
            audio.filename,
            audio.content_type or 'application/octet-stream'
        )

    except Exception:
        logger.exception(
            'Audio transcription failed for %s',
            audio.filename
        )

        raise HTTPException(
            status_code=502,
            detail='Audio transcription failed. Please try recording again.'
        )

    # -------------------------
    # READ IMAGE
    # -------------------------

    image_bytes = await image.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail='The image is empty.'
        )

    # -------------------------
    # IMAGE + TEXT → LLM
    # -------------------------

    try:
        answer = ask_llm(
            text,
            image_bytes,
            image.content_type or 'image/jpeg'
        )

    except Exception:
        logger.exception('LLM request failed')

        raise HTTPException(
            status_code=502,
            detail='AI response generation failed.'
        )

    # -------------------------
    # RESPONSE
    # -------------------------

    return {
        'message': 'file received successfully',
        'user_id': current_user[0],
        'image': image.filename,
        'audio': audio.filename,
        'transcription': text,
        'answer': answer
    }