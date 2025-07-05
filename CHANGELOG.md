## 📦 CHANGELOG – Proyecto Web Institucional

### 📅 Día 1 – Inicio del periodo de prueba (Turing-IA)

* ✅ Setup de React + Vite + Tailwind CSS
* ✅ Modal de login animado con Framer Motion
* ✅ Estructura de carpetas para roles: Admin, Profesor, Alumno
* ✅ Sistema de rutas y navegación
* ✅ Implementación de backend con FastAPI y SQLAlchemy
* ✅ Endpoints base para login, materias y grupos

### 📅 Día 2 – Implementaciones técnicas

#### 🔐 Seguridad

* 🔁 Unificación de `SECRET_KEY` para evitar errores 401
* 🔒 Validación correcta con `allow_roles("admin")` usando `decode_access_token`

#### 👨‍🏫 Gestión de Profesores

* ✅ Alta con usuario y contraseña generados automáticamente
* ✅ Edición de materia y grupos
* ✅ Modal de cambio de contraseña

#### 👨‍🎓 Gestión de Alumnos

* ✅ Listado filtrado por turno, grado y grupo
* ✅ Corrección de agrupamiento con función `normalizar()`
* ✅ Modal de cambio de contraseña por alumno

#### 🧠 Extras

* 🥪 `console.log` para verificación de datos reales
* 🛠️ Manejo de errores más claro (`res.ok`, `res.json()`)

### 📅 Día 3 – Foro y mejoras visuales

* ✅ Creación, edición y borrado de publicaciones
* ✅ Subida de imágenes y archivos adjuntos con preview
* ✅ Comentarios dinámicos por post
* ✅ Diseño mejorado para móvil (Foro, Dashboards, Formularios)
* ✅ Encabezado fijo y estilizado para el foro
* ✅ Líneas amarillas decorativas en publicaciones y comentarios
* ✅ Botón "Publicar" mejorado para dispositivos pequeños
* ✅ Estilo unificado en dashboards de Admin, Profesor y Alumno
* ✅ ChatBot movido para evitar conflicto con botón "Volver arriba"

---

## ✨ Frase para mantenernos motivados

> "Cualquier persona que deja de aprender es viejo, ya sea a los veinte u ochenta. Cualquier persona que sigue aprendiendo se mantiene joven. La cosa más grande en la vida es mantener la mente joven."
> — *Henry Ford*