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
- 🔐 **JWT opcional**
- 📦 **Uvicorn** para servidor local

---

## 📋 Funcionalidades implementadas

### 🌐 Frontend

- ✅ Navegación responsiva y hero interactivo
- ✅ Modal de login animado (glassmorphism + Framer Motion)
- ✅ Paleta de colores institucional alternable
- ✅ Sistema de roles: administrador, profesor y alumno
- ✅ Interfaz diferenciada por rol:
  - Admin: gestión de profesores, materias, grupos y alumnos
  - Profesor: gestión de grupos y foros por materia
  - Alumno: acceso a foros y anuncios por grupo
- ✅ CRUD dinámico y conectado para:
  - Profesores (alta/baja, generación de usuarios)
  - Materias
  - Grupos
  - Alumnos (con generación automática de credenciales)
- ✅ Foro **global** y **grupal**:
  - Publicación de anuncios por parte de profesores
  - Comentarios y reacciones por alumnos
  - Visualización de nombre, materia y grupo en publicaciones
- ✅ Diseño adaptado a dispositivos móviles y transiciones suaves

### 🔧 Backend

- ✅ Autenticación por rol (Admin / Profesor / Alumno)
- ✅ Login persistente (localStorage + Context API)
- ✅ Endpoints RESTful conectados a base de datos
- ✅ CRUD para usuarios, materias, grupos y foros
- ✅ Lógica de validación, middlewares, manejo de errores
- ✅ Asociación de entidades (por ejemplo, profesor con grupo y materia)
- ✅ Comentarios y reacciones por endpoint

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

## 📌 Próximos pasos

- [ ] Activar y documentar JWT para seguridad extra
- [ ] Subir versión pública a **Vercel** y **Railway** o similar
- [ ] Crear sistema de notificaciones internas
- [ ] Agregar subida de archivos en foros y noticias
- [ ] Implementar panel visual de estadísticas para el Admin