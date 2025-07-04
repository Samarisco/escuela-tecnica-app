from pydantic import BaseModel
from typing import List, Optional
from datetime import date   , datetime

# --- Admin ---
class AdminCreate(BaseModel):
    employee_number: str
    password: str

# --- Login ---
class LoginRequest(BaseModel):
    employee_number: str
    password: str

class LoginResponse(BaseModel):
    role: str
    usuario: str


# --- Materias ---
class MateriaCreate(BaseModel):
    nombre: str

class MateriaOut(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

# --- Grupos ---
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

# --- Profesores ---
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

# --- Alumnos ---
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

# --- Publicaciones ---
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


class ComentarioCreate(BaseModel):
    publicacion_id: int
    autor: str
    contenido: str

class ReaccionCreate(BaseModel):
    publicacion_id: int
    tipo: str
    autor: str

class ComentarioOut(BaseModel):
    id: int
    autor: str
    contenido: str
    fecha: datetime

    class Config:
        orm_mode = True

class ReaccionOut(BaseModel):
    id: int
    tipo: str
    autor: str

    class Config:
        orm_mode = True

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

class AlumnoPasswordUpdate(BaseModel):
    password: str