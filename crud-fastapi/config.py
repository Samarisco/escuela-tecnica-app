import os

SECRET_KEY = os.getenv("SECRET_KEY", "clave_secreta_por_defecto")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
