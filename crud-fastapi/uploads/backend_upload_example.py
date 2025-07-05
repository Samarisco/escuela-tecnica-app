from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/upload/")
async def upload_file(
    imagen: UploadFile = File(None),
    archivo: UploadFile = File(None),
    titulo: str = Form(...),
    contenido: str = Form(...),
    autor: str = Form(...)
):
    imagen_url = None
    archivo_url = None

    if imagen:
        img_path = UPLOAD_DIR / f"{datetime.utcnow().timestamp()}_{imagen.filename}"
        with img_path.open("wb") as buffer:
            shutil.copyfileobj(imagen.file, buffer)
        imagen_url = str(img_path)

    if archivo:
        file_path = UPLOAD_DIR / f"{datetime.utcnow().timestamp()}_{archivo.filename}"
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(archivo.file, buffer)
        archivo_url = str(file_path)

    return {
        "titulo": titulo,
        "contenido": contenido,
        "autor": autor,
        "imagen_url": imagen_url,
        "archivo_url": archivo_url,
    }