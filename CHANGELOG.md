
# 📦 CHANGELOG – Proyecto Web Institucional

## 📅 Día 1 – Inicio del periodo de prueba (Turing-IA)
- ✅ Setup de React + Vite + Tailwind CSS
- ✅ Modal de login animado con Framer Motion
- ✅ Estructura de carpetas para roles: Admin, Profesor, Alumno
- ✅ Sistema de rutas y navegación
- ✅ Implementación de backend con FastAPI y SQLAlchemy
- ✅ Endpoints base para login, materias y grupos

## 📅 Día 2 – Implementaciones técnicas
### 🔐 Seguridad
- 🔁 Unificación de `SECRET_KEY` para evitar errores 401
- 🔒 Validación correcta con `allow_roles("admin")` usando `decode_access_token`

### 👨‍🏫 Gestión de Profesores
- ✅ Alta con usuario y contraseña generados automáticamente
- ✅ Edición de materia y grupos
- ✅ Modal de cambio de contraseña

### 👨‍🎓 Gestión de Alumnos
- ✅ Listado filtrado por turno, grado y grupo
- ✅ Corrección de agrupamiento con función `normalizar()`
- ✅ Modal de cambio de contraseña por alumno

### 🧠 Extras
- 🧪 `console.log` para verificación de datos reales
- 🛠️ Manejo de errores más claro (`res.ok`, `res.json()`)

## 📌 Pendientes para Día 3
- [ ] Corrección final de secciones de Profesor y Alumno
- [ ] Sistema de publicaciones y foros
- [ ] Evaluaciones cognitivas (externas)
- [ ] Video de presentación
- [ ] Publicación del proyecto (Vercel / Railway)

