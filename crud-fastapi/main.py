from fastapi import FastAPI, Depends, HTTPException, Security, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
from jose import JWTError, jwt
from datetime import timedelta, datetime
from passlib.context import CryptContext
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from database import SessionLocal, engine
from models import (
    Base, User, Subject, Group, Teacher, Student,
    Publicacion, PublicacionGlobal, Comentario, Reaccion
)
from schemas import (
    AdminCreate, LoginResponse,
    MateriaCreate, MateriaOut,
    GrupoCreate, GrupoOut,
    ProfesorCreate, ProfesorOut,
    AlumnoCreate, AlumnoOut,
    PublicacionGlobalCreate, PublicacionGlobalOut,
    ComentarioCreate, ComentarioOut,
    ReaccionCreate, ReaccionOut,
    AlumnoPasswordUpdate
)
from dependencies import get_current_user, allow_roles


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Security(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        rol: str = payload.get("rol")
        if username is None or rol is None:
            raise credentials_exception
        return {"sub": username, "rol": rol}
    except JWTError:
        raise credentials_exception

# === CONFIGURACIÓN APP ===
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# === RUTA DE PRUEBA ===
@app.get("/")
def root():
    return {"message": "Servidor funcionando correctamente ✅"}

# === LOGIN UNIFICADO ===
@app.post("/login", response_model=LoginResponse)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username = form_data.username
    password = form_data.password

    # ADMIN
    user = db.query(User).filter(User.employee_number == username).first()
    if user and verify_password(password, user.password):
        token = create_access_token({"sub": user.employee_number, "rol": user.role})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user.role,
            "usuario": user.employee_number
        }

    # PROFESOR
    profe = db.query(Teacher).filter(Teacher.usuario == username).first()
    if profe and verify_password(password, profe.password):
        token = create_access_token({"sub": profe.usuario, "rol": profe.role})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": profe.role,
            "usuario": profe.usuario
        }

    # ALUMNO
    alumno = db.query(Student).filter(Student.usuario == username).first()
    if alumno and verify_password(password, alumno.password):
        token = create_access_token({"sub": alumno.usuario, "rol": "alumno"})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": "alumno",
            "usuario": alumno.usuario
        }

    raise HTTPException(status_code=400, detail="Credenciales incorrectas")

# === REGISTRO ADMIN ===
@app.post("/register-admin")
def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.employee_number == admin.employee_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe ese número de empleado")
    hashed_password = get_password_hash(admin.password)
    new_admin = User(employee_number=admin.employee_number, password=hashed_password, role="admin")
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"message": "Administrador creado", "id": new_admin.id}

# === MATERIAS ===
@app.post("/materias", response_model=MateriaOut)
def crear_materia(materia: MateriaCreate, db: Session = Depends(get_db), user: dict = Depends(allow_roles("admin"))):
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

# === GRUPOS ===
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

# === PROFESORES ===
@app.post("/profesores", response_model=ProfesorOut)
def crear_profesor(profesor: ProfesorCreate, db: Session = Depends(get_db), user: dict = Depends(allow_roles("admin"))):
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

@app.put("/profesores/{profesor_id}")
def actualizar_profesor(profesor_id: int, datos: dict, db: Session = Depends(get_db)):
    profesor = db.query(Teacher).filter(Teacher.id == profesor_id).first()
    if not profesor:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    if "password" in datos:
        profesor.password = get_password_hash(datos["password"])
    if "materia" in datos:
        profesor.materia = datos["materia"]
    if "grupos" in datos:
        profesor.grupos = datos["grupos"]
    db.commit()
    db.refresh(profesor)
    return {"message": "Profesor actualizado correctamente"}

# === ALUMNOS ===
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
def listar_alumnos(db: Session = Depends(get_db), user: dict = Depends(allow_roles("admin", "profesor"))):
    return db.query(Student).all()

@app.put("/alumnos/{alumno_id}")
def actualizar_contraseña_alumno(alumno_id: int, datos: AlumnoPasswordUpdate, db: Session = Depends(get_db)):
    alumno = db.query(Student).filter(Student.id == alumno_id).first()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    hashed_password = get_password_hash(datos.password)
    alumno.password = hashed_password
    db.commit()
    return {"message": "Contraseña actualizada"}

# === INFO USUARIO ===
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

# === RUTA PROTEGIDA JWT ===
@app.get("/protegido")
def ruta_segura(user_data: dict = Depends(get_current_user)):
    return {
        "mensaje": "Bienvenido al área protegida",
        "usuario": user_data["sub"],
        "rol": user_data["rol"]
    }
