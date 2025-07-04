from sqlalchemy import Column, Integer, String, JSON, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship  
from database import Base
from datetime import datetime



class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    employee_number = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    grado = Column(String(10), nullable=False)
    turno = Column(String(20), nullable=False)
    letra = Column(String(5), nullable=False)

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    apellido = Column(String)
    fecha_entrada = Column(String)
    materia = Column(String)
    usuario = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
    grupos = Column(JSON)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    apellido = Column(String)
    usuario = Column(String, unique=True)
    password = Column(String)
    grupo = Column(String)

class Publicacion(Base):
    __tablename__ = "publicaciones"
    id = Column(Integer, primary_key=True, index=True)
    grupo = Column(String, index=True)  # Ej: '1°A - Matutino'
    materia = Column(String)  # Ej: 'Matemáticas'
    titulo = Column(String)
    contenido = Column(Text)
    autor = Column(String)  # usuario del profesor
    fecha = Column(DateTime, default=datetime.utcnow)

class PublicacionGlobal(Base):
    __tablename__ = "publicaciones_globales"
    id = Column(Integer, primary_key=True, index=True)
    autor = Column(String)
    titulo = Column(String)
    contenido = Column(Text)
    fecha = Column(DateTime, default=datetime.utcnow)
    archivo_url = Column(String, nullable=True)
    imagen_url = Column(String, nullable=True)

    comentarios = relationship("Comentario", back_populates="publicacion", cascade="all, delete")
    reacciones = relationship("Reaccion", back_populates="publicacion", cascade="all, delete")

class Comentario(Base):
    __tablename__ = "comentarios"
    id = Column(Integer, primary_key=True, index=True)
    publicacion_id = Column(Integer, ForeignKey("publicaciones_globales.id"))
    autor = Column(String)
    contenido = Column(Text)
    fecha = Column(DateTime, default=datetime.utcnow)

    publicacion = relationship("PublicacionGlobal", back_populates="comentarios")

class Reaccion(Base):
    __tablename__ = "reacciones"
    id = Column(Integer, primary_key=True, index=True)
    publicacion_id = Column(Integer, ForeignKey("publicaciones_globales.id"))
    tipo = Column(String)  # like, dislike, etc.
    autor = Column(String)

    publicacion = relationship("PublicacionGlobal", back_populates="reacciones")