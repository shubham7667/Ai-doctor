from fastapi import APIRouter,Depends
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get('/me')
def get_me(current_user=Depends(get_current_user)):
   return {
        'id': current_user[0],
        'google_id': current_user[1],
        'email': current_user[2],
        'name': current_user[3],
        'profile_pic': current_user[4]
    }