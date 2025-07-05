
# 🏫 Proyecto Web Institucional – Escuela Secundaria Técnica

Este proyecto representa una **plataforma web moderna y funcional** para una escuela secundaria técnica, desarrollada con **React**, **Tailwind CSS** y **FastAPI**. Diseñada para ser responsiva, intuitiva y escalable, permite gestionar profesores, alumnos, materias, grupos y foros académicos.

---

## 🛠️ Tecnologías utilizadas

### Frontend
- ⚛️ **React**
- 🎨 **Tailwind CSS**
- ✨ **Framer Motion**
- ⚡ **Vite**
- 💡 **React Icons**
- 🧱 **Context API** para manejo de autenticación
- 🌐 **Axios** para consumo de API

### Backend
- 🐍 **FastAPI**
- 🐘 **PostgreSQL** (u otra base real conectada)
- 🛠️ **SQLAlchemy** (ORM)
- 🔐 **JWT**
- 📦 **Uvicorn** para servidor local

---

## 📋 Funcionalidades implementadas

### ✅ Día 1 – Inicio del Proyecto
- Creación del proyecto base con React + Vite + Tailwind
- Setup inicial de rutas, layout general y cambio de tema (dark/light)
- Modal de login animado con Framer Motion
- Configuración de roles (`admin`, `profesor`, `alumno`)
- Interfaz modular con navegación lateral según rol
- Backend funcional con FastAPI, CORS y base de datos SQLite/PostgreSQL

### ✅ Día 2 – Gestión de Profesores y Alumnos
#### 🔐 Seguridad:
- Corrección de inconsistencias en JWT: unificación de `SECRET_KEY` y `decode_access_token`
- Validación efectiva por rol con `allow_roles("admin")`

#### 👨‍🏫 Profesores:
- Alta de profesores con generación automática de usuario y contraseña
- Verificación de duplicados y validación de campos
- Edición de grupos y materia asignada desde modal
- Cambio de contraseña individual desde interfaz

#### 👨‍🎓 Alumnos:
- Listado completo por grupo, grado y turno (Matutino/Vespertino)
- Corrección de lógica de agrupamiento (`normalizar` mejorado)
- Modal de cambio de contraseña individual
- Uso del patrón `"grado°letra - turno"` como identificador de grupo

#### 🧠 Extras:
- Mejora en manejo de errores: lectura de `res.json()` con `res.ok`
- Debug visual con `console.log` para validar estructuras recibidas

---

## 📌 Pendientes para el Día 3 (por documento de evaluación Turing-IA)

- [ ] **Revisión y refinamiento de la sección `Alumno` y `Profesor`** para asegurar funcionamiento completo
- [ ] Documentar uso de JWT y control de roles en el frontend
- [ ] Agregar validación visual para formularios (campos vacíos, retroalimentación)
- [ ] Añadir un panel de edición para admins más robusto
- [ ] Comenzar con la sección de publicaciones grupales y foro global
- [ ] Evaluaciones cognitivas (externas) y entrega de video de presentación

---

## 🖼️ Capturas del proyecto

| Página principal | Modal de login | Panel Admin |
|------------------|----------------|-------------|
| ![Home](screenshots/home.png) | ![Login](screenshots/login.png) | ![Admin](screenshots/admin.png) |

---

## 🚀 Instalación local

### Frontend

```bash
git clone https://github.com/tu-usuario/escuela-tecnica-app.git
cd escuela-tecnica-app
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) para ver el frontend.

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

El backend correrá en [http://localhost:8000](http://localhost:8000)

---

## 📁 Estructura del proyecto

```
├── frontend/
│   ├── src/components/
│   ├── src/pages/Admin/
│   ├── src/pages/Profesor/
│   ├── src/pages/Alumno/
│   └── ...
├── backend/
│   ├── models/
│   ├── routers/
│   ├── database.py
│   ├── main.py
│   └── ...
```

---

## ✍️ Autor

**Juan Samael Amaral Bravo**  
Frontend y Backend Developer en formación | Ingeniería en Sistemas Computacionales  
👨‍💻 [LinkedIn](https://www.linkedin.com/in/samaelamaral/) | 🕹️ Apasionado por la tecnología, educación y videojuegos

---

## 📌 Próximos pasos (Día 3 – según lineamientos de evaluación)

- [ ] Agregar video de presentación (máximo 2 min) con las preguntas solicitadas
- [ ] Finalizar secciones faltantes de Profesor y Alumno
- [ ] Crear y documentar API de publicaciones globales y grupales
- [ ] Subir versión pública a **Vercel** (Frontend) y **Railway** (Backend)
- [ ] Evaluación de habilidades cognitivas finales
- [ ] Posible reunión con área de selección de Turing

---

## ✨ Frase para mantenernos motivados

> "Cualquier persona que deja de aprender es viejo, ya sea a los veinte u ochenta. Cualquier persona que sigue aprendiendo se mantiene joven. La cosa más grande en la vida es mantener la mente joven."  
> — *Henry Ford*
