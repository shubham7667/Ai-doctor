from fastapi import APIRouter, Request,Response,HTTPException,Depends
from authlib.integrations.starlette_client import OAuth
from starlette.responses import RedirectResponse
from app.core.config import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
)
from jose import JWTError,jwt
from app.core.config import JWT_SECRET_KEY
from app.database.user_query import get_user_by_google_id, create_user
from app.core.security import create_access_token
from app.database.user_query import get_user_by_user_id
from app.core.dependencies import get_current_user

router = APIRouter()
oauth = OAuth()

oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)


@router.get('/google/login')
async def googleAuth(request: Request):
    if request.url.hostname != 'localhost':
        return RedirectResponse(
            'http://localhost:8000/auth/google/login',
            status_code=307
        )

    google = oauth.create_client('google')

    return await google.authorize_redirect(
        request,
        GOOGLE_REDIRECT_URI
    )


@router.get('/google/callback')
async def callback(request: Request,response:Response):
    google = oauth.create_client('google')

    token = await google.authorize_access_token(request)
    if not token:
        raise HTTPException(
            status_code=401,
            detail='User not found'
        )
    user = token.get('userinfo')

    google_id = user['sub']
    email = user['email']
    name = user['name']
    picture = user['picture']

    existing_user = get_user_by_google_id(google_id)

    if existing_user:
        token = create_access_token({
            'user_id': existing_user[0]
        })
        response.set_cookie(
                key='access_token',
                value=token,
                httponly=True
                
            )

        return {
            'id': existing_user[0],
            'email': existing_user[2],
            'name': existing_user[3],
        }

    user_id = create_user(
        google_id,
        email,
        name,
        picture
    )

    token = create_access_token({
        'user_id': user_id
    })
    response.set_cookie(
            key='access_token',
            value=token,
            httponly=True
            
        )

    return {
        'id': user_id,
        'email': email,
        'name': name,
    }

@router.post('/logout')
def logout(response:Response):
    response.delete_cookie(key='access_token')
    
    return{
        'message':'Logged out successfully'
    }
