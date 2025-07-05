from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from utils.auth import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido")
    return payload

def allow_roles(*roles):
    def validator(user_data: dict = Depends(get_current_user)):
        if user_data["rol"] not in roles:
            raise HTTPException(status_code=403, detail="Acceso denegado")
        return user_data
    return validator
