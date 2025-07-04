from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Modelos
from models import (
    Base,
    User,
    Subject,
    Group,
    Teacher,
    Student,
    Publicacion,
    PublicacionGlobal,
    Comentario,
    Reaccion
)

# Esquemas
from schemas import (
    AdminCreate,
    LoginRequest,
    LoginResponse,
    MateriaCreate,
    MateriaOut,
    GrupoCreate,
    GrupoOut,
    ProfesorCreate,
    ProfesorOut,
    AlumnoCreate,
    AlumnoOut,
    PublicacionCreate,
    PublicacionOut,
    PublicacionGlobalCreate,
    PublicacionGlobalOut,
    ComentarioCreate,
    ComentarioOut,
    ReaccionCreate,
    ReaccionOut,
    AlumnoPasswordUpdate
)

# DB y seguridad
from database import SessionLocal, engine
from passlib.context import CryptContext

# Inicializar FastAPI
app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas
Base.metadata.create_all(bind=engine)

# Configurar hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Dependencia de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- RUTA INICIAL ----------
@app.get("/")
def root():
    return {"message": "Servidor funcionando correctamente ✅"}


# ---------- LOGIN ----------
@app.post("/login", response_model=LoginResponse)
def login_user(credentials: LoginRequest, db: Session = Depends(get_db)):
    try:
        # Admin
        user = db.query(User).filter(User.employee_number == credentials.employee_number).first()
        if user and verify_password(credentials.password, user.password):
            return {"role": user.role, "usuario": user.employee_number}

        # Profesor
        profe = db.query(Teacher).filter(Teacher.usuario == credentials.employee_number).first()
        if profe and verify_password(credentials.password, profe.password):
            return {"role": profe.role, "usuario": profe.usuario}

        # Alumno ✅
        alumno = db.query(Student).filter(Student.usuario == credentials.employee_number).first()
        if alumno and verify_password(credentials.password, alumno.password):
            return {"role": "alumno", "usuario": alumno.usuario}

        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno")


# ---------- ADMIN ----------
@app.post("/register-admin")
def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.employee_number == admin.employee_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe ese número de empleado")

    hashed_password = get_password_hash(admin.password)
    new_admin = User(
        employee_number=admin.employee_number,
        password=hashed_password,
        role="admin",
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"message": "Administrador creado", "id": new_admin.id}

# ---------- MATERIAS ----------
@app.post("/materias", response_model=MateriaOut)
def crear_materia(materia: MateriaCreate, db: Session = Depends(get_db)):
    existe = db.query(Subject).filter(Subject.nombre == materia.nombre).first()
    if existe:
        raise HTTPException(status_code=400, detail="Materia ya existente")
    nueva = Subject(nombre=materia.nombre)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@app.get("/materias", response_model=List[MateriaOut])
def listar_materias(db: Session = Depends(get_db)):
    return db.query(Subject).all()

# ---------- GRUPOS ----------
@app.post("/grupos", response_model=GrupoOut)
def crear_grupo(grupo: GrupoCreate, db: Session = Depends(get_db)):
    existe = db.query(Group).filter(
        Group.grado == grupo.grado,
        Group.turno == grupo.turno,
        Group.letra == grupo.letra,
    ).first()
    if existe:
        raise HTTPException(status_code=400, detail="Grupo ya existente")
    nuevo = Group(grado=grupo.grado, turno=grupo.turno, letra=grupo.letra)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@app.get("/grupos", response_model=List[GrupoOut])
def listar_grupos(db: Session = Depends(get_db)):
    return db.query(Group).all()

# ---------- PROFESORES ----------
@app.post("/profesores", response_model=ProfesorOut)
def crear_profesor(profesor: ProfesorCreate, db: Session = Depends(get_db)):
    existe = db.query(Teacher).filter(Teacher.usuario == profesor.usuario).first()
    if existe:
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    hashed_password = get_password_hash(profesor.password)
    nuevo = Teacher(
        nombre=profesor.nombre,
        apellido=profesor.apellido,
        fecha_entrada=profesor.fechaEntrada,
        materia=profesor.materia,
        usuario=profesor.usuario,
        password=hashed_password,
        role=profesor.role,
        grupos=profesor.grupos or [],
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@app.get("/profesores", response_model=List[ProfesorOut])
def listar_profesores(db: Session = Depends(get_db)):
    return db.query(Teacher).all()

@app.get("/profesores/{usuario}/grupos", response_model=List[str])
def obtener_grupos_profesor(usuario: str, db: Session = Depends(get_db)):
    profe = db.query(Teacher).filter(Teacher.usuario == usuario).first()
    if not profe:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    return profe.grupos or []

# ---------- ALUMNOS ----------
@app.post("/alumnos", response_model=AlumnoOut)
def crear_alumno(alumno: AlumnoCreate, db: Session = Depends(get_db)):
    base_usuario = f"{alumno.apellido.lower()}{alumno.nombre[0].lower()}"
    usuario = base_usuario
    contador = 1
    while db.query(Student).filter(Student.usuario == usuario).first():
        usuario = f"{base_usuario}{contador}"
        contador += 1

    password = f"00{usuario}"
    hashed_password = get_password_hash(password)

    nuevo = Student(
        nombre=alumno.nombre,
        apellido=alumno.apellido,
        usuario=usuario,
        password=hashed_password,
        grupo=alumno.grupo,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@app.get("/alumnos", response_model=List[AlumnoOut])
def listar_alumnos(db: Session = Depends(get_db)):
    return db.query(Student).all()

@app.get("/alumnos/grupo/{grupo_nombre}", response_model=List[AlumnoOut])
def obtener_alumnos_por_grupo(grupo_nombre: str, db: Session = Depends(get_db)):
    return db.query(Student).filter(Student.grupo == grupo_nombre).all()

@app.put("/alumnos/{alumno_id}")
def actualizar_contraseña_alumno(alumno_id: int, datos: AlumnoPasswordUpdate, db: Session = Depends(get_db)):
    alumno = db.query(Student).filter(Student.id == alumno_id).first()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    hashed_password = get_password_hash(datos.password)
    alumno.password = hashed_password
    db.commit()
    return {"message": "Contraseña actualizada"}

@app.delete("/eliminar-todo")
def eliminar_todo(db: Session = Depends(get_db)):
    db.query(Student).delete()
    db.query(Group).delete()
    db.commit()
    return {"message": "Todos los alumnos y grupos han sido eliminados"}

# ---------- FORO POR GRUPO ----------
@app.post("/foro", response_model=PublicacionOut)
def crear_publicacion(pub: PublicacionCreate, db: Session = Depends(get_db)):
    nueva = Publicacion(**pub.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@app.get("/foro/{grupo}", response_model=List[PublicacionOut])
def publicaciones_por_grupo(grupo: str, db: Session = Depends(get_db)):
    return db.query(Publicacion).filter(Publicacion.grupo == grupo).order_by(Publicacion.fecha.desc()).all()

@app.put("/foro/{id}", response_model=PublicacionOut)
def actualizar_publicacion(id: int, datos: dict, db: Session = Depends(get_db)):
    pub = db.query(Publicacion).filter(Publicacion.id == id).first()
    if not pub:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")
    for key, value in datos.items():
        setattr(pub, key, value)
    db.commit()
    db.refresh(pub)
    return pub

@app.delete("/foro/{id}")
def eliminar_publicacion(id: int, db: Session = Depends(get_db)):
    pub = db.query(Publicacion).filter(Publicacion.id == id).first()
    if not pub:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")
    db.delete(pub)
    db.commit()
    return {"message": "Publicación eliminada"}

# ---------- FORO GLOBAL ----------
@app.post("/foro-global", response_model=PublicacionGlobalOut)
def crear_publicacion_global(pub: PublicacionGlobalCreate, db: Session = Depends(get_db)):
    nueva = PublicacionGlobal(**pub.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@app.get("/foro-global", response_model=List[PublicacionGlobalOut])
def obtener_publicaciones_globales(db: Session = Depends(get_db)):
    return db.query(PublicacionGlobal).order_by(PublicacionGlobal.fecha.desc()).all()

@app.post("/foro-global/comentario", response_model=ComentarioOut)
def agregar_comentario(c: ComentarioCreate, db: Session = Depends(get_db)):
    comentario = Comentario(**c.dict())
    db.add(comentario)
    db.commit()
    db.refresh(comentario)
    return comentario

@app.post("/foro-global/reaccion", response_model=ReaccionOut)
def agregar_reaccion(r: ReaccionCreate, db: Session = Depends(get_db)):
    reaccion = Reaccion(**r.dict())
    db.add(reaccion)
    db.commit()
    db.refresh(reaccion)
    return reaccion

# ---------- INFO DE USUARIO PARA IDENTIFICACIÓN EN COMENTARIOS ----------
@app.get("/usuario-info/{usuario}")
def obtener_info_usuario(usuario: str, db: Session = Depends(get_db)):
    profe = db.query(Teacher).filter(Teacher.usuario == usuario).first()
    if profe:
        return {
            "tipo": "profesor",
            "nombre": f"{profe.nombre} {profe.apellido}",
            "materia": profe.materia
        }

    alumno = db.query(Student).filter(Student.usuario == usuario).first()
    if alumno:
        return {
            "tipo": "alumno",
            "nombre": f"{alumno.nombre} {alumno.apellido}",
            "grupo": alumno.grupo
        }

    user = db.query(User).filter(User.employee_number == usuario).first()
    if user:
        return {
            "tipo": "admin",
            "nombre": user.employee_number
        }

    raise HTTPException(status_code=404, detail="Usuario no encontrado")
