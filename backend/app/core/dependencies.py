from fastapi import Request, HTTPException
from jose import jwt, JWTError
from app.database.user_query import get_user_by_user_id

from app.core.config import JWT_SECRET_KEY

def get_current_user(request:Request):
    token = request.cookies.get('access_token')
    
    if not token:
        raise HTTPException(
            status_code=401,
            detail='Not authorized'
        )
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=['HS256']
        )
        user_id =  payload['user_id']
    except (JWTError, KeyError):
        raise HTTPException(
            status_code=401,
            detail='Invalid token'
        )
    user = get_user_by_user_id(user_id)
    if not user:
        raise HTTPException(
            status_code=401,
            detail='user not found.'
        )
    return user