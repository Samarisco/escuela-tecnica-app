from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ---------- ADMIN ----------
class AdminCreate(BaseModel):
    employee_number: str
    password: str

# ---------- LOGIN ----------
class LoginResponse(BaseModel):
    role: str
    usuario: str
    access_token: str


# ---------- MATERIAS ----------
class MateriaCreate(BaseModel):
    nombre: str

class MateriaOut(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

# ---------- GRUPOS ----------
class GrupoCreate(BaseModel):
    grado: str
    turno: str
    letra: str

class GrupoOut(BaseModel):
    id: int
    grado: str
    turno: str
    letra: str

    class Config:
        from_attributes = True

# ---------- PROFESORES ----------
class ProfesorCreate(BaseModel):
    nombre: str
    apellido: str
    fechaEntrada: str
    materia: str
    usuario: str
    password: str
    role: str
    grupos: Optional[List[str]] = []

class ProfesorOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    usuario: str
    materia: str
    grupos: List[str]

    class Config:
        from_attributes = True

class ProfesorPasswordUpdate(BaseModel):
    password: str

class ProfesorUpdate(BaseModel):
    materia: Optional[str] = None
    grupos: Optional[List[str]] = None
    password: Optional[str] = None

# ---------- ALUMNOS ----------
class AlumnoCreate(BaseModel):
    nombre: str
    apellido: str
    grupo: str

class AlumnoOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    usuario: str
    grupo: str

    class Config:
        from_attributes = True

class AlumnoPasswordUpdate(BaseModel):
    password: str

# ---------- PUBLICACIONES ----------
class PublicacionCreate(BaseModel):
    grupo: str
    materia: str
    titulo: str
    contenido: str
    autor: str

class PublicacionOut(BaseModel):
    id: int
    grupo: str
    materia: str
    titulo: str
    contenido: str
    autor: str
    fecha: datetime

    class Config:
        from_attributes = True

# ---------- COMENTARIOS Y REACCIONES ----------
class ComentarioCreate(BaseModel):
    publicacion_id: int
    autor: str
    contenido: str

class ComentarioOut(BaseModel):
    id: int
    autor: str
    contenido: str
    fecha: datetime

    class Config:
        orm_mode = True

class ReaccionCreate(BaseModel):
    publicacion_id: int
    tipo: str
    autor: str

class ReaccionOut(BaseModel):
    id: int
    tipo: str
    autor: str

    class Config:
        orm_mode = True

# ---------- PUBLICACIÓN GLOBAL ----------
class PublicacionGlobalCreate(BaseModel):
    autor: str
    titulo: str
    contenido: str
    archivo_url: Optional[str] = None
    imagen_url: Optional[str] = None

class PublicacionGlobalOut(BaseModel):
    id: int
    autor: str
    titulo: str
    contenido: str
    archivo_url: Optional[str]
    imagen_url: Optional[str]
    fecha: datetime
    comentarios: List[ComentarioOut]
    reacciones: List[ReaccionOut]

    class Config:
        orm_mode = True
