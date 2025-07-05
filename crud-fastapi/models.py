from sqlalchemy import Column, Integer, String, JSON, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# === ADMIN ===
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    employee_number = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)

# === MATERIAS ===
class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)

# === GRUPOS ===
class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    grado = Column(String(10), nullable=False)
    turno = Column(String(20), nullable=False)
    letra = Column(String(5), nullable=False)

# === PROFESORES ===
class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    fecha_entrada = Column(String(50), nullable=False)
    materia = Column(String(100), nullable=False)
    usuario = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    grupos = Column(JSON, default=[])

# === ALUMNOS ===
class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    usuario = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    grupo = Column(String(50), nullable=False)

# === PUBLICACIONES POR GRUPO ===
class Publicacion(Base):
    __tablename__ = "publicaciones"
    id = Column(Integer, primary_key=True, index=True)
    grupo = Column(String(50), index=True, nullable=False)  # Ej: '1°A - Matutino'
    materia = Column(String(100), nullable=False)           # Ej: 'Matemáticas'
    titulo = Column(String(200), nullable=False)
    contenido = Column(Text, nullable=False)
    autor = Column(String(100), nullable=False)             # usuario del profesor
    fecha = Column(DateTime, default=datetime.utcnow)

# === PUBLICACIONES GLOBALES ===
class PublicacionGlobal(Base):
    __tablename__ = "publicaciones_globales"
    id = Column(Integer, primary_key=True, index=True)
    autor = Column(String(100), nullable=False)
    titulo = Column(String(200), nullable=False)
    contenido = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    archivo_url = Column(String(300), nullable=True)
    imagen_url = Column(String(300), nullable=True)

    comentarios = relationship("Comentario", back_populates="publicacion", cascade="all, delete-orphan")
    reacciones = relationship("Reaccion", back_populates="publicacion", cascade="all, delete-orphan")

# === COMENTARIOS ===
class Comentario(Base):
    __tablename__ = "comentarios"
    id = Column(Integer, primary_key=True, index=True)
    publicacion_id = Column(Integer, ForeignKey("publicaciones_globales.id"), nullable=False)
    autor = Column(String(100), nullable=False)
    contenido = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)

    publicacion = relationship("PublicacionGlobal", back_populates="comentarios")

# === REACCIONES ===
class Reaccion(Base):
    __tablename__ = "reacciones"
    id = Column(Integer, primary_key=True, index=True)
    publicacion_id = Column(Integer, ForeignKey("publicaciones_globales.id"), nullable=False)
    tipo = Column(String(50), nullable=False)  # like, dislike, etc.
    autor = Column(String(100), nullable=False)

    publicacion = relationship("PublicacionGlobal", back_populates="reacciones")
