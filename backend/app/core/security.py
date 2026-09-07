from jose import jwt   
from app.core.config import JWT_SECRET_KEY
from datetime import timezone,datetime,timedelta

ALGORITHM='HS256'
def create_access_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)

    data['exp'] = expire

    token = jwt.encode(
        data,
        JWT_SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token