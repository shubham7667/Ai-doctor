from fastapi import FastAPI
from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from starlette.middleware.sessions import SessionMiddleware
import os
from app.core.config import secret_key
from app.database.connection import get_connection
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(
    SessionMiddleware,
    secret_key = secret_key
)
app.include_router(auth_router,prefix='/auth')
app.include_router(user_router,prefix='/user')

@app.get('/')
def home():
    return {
        'message':'hello'
    }


@app.get('/db_connection')
def connection():
    connection=get_connection()
    connection.close()
    return{
        'message':'db connected successfully'
    }
