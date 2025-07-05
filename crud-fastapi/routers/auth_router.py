from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from utils.auth import verify_password, create_access_token
from database import get_db
from models import User

router = APIRouter()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Buscar por employee_number (no username)
    user = db.query(User).filter(User.employee_number == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    # Generar token JWT
    token = create_access_token(data={"sub": user.employee_number, "rol": user.role})

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": user.employee_number,
        "role": user.role
    }
