import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  RiUserSettingsLine,
  RiLogoutBoxLine,
  RiFolder3Line,
  RiBook3Line,
  RiAwardLine,
  RiHome2Line,
  RiUserAddLine,
  RiChat1Line,
  RiArrowUpLine,
} from "react-icons/ri";
import { FcExpand, FcMinus } from "react-icons/fc";

import ModalWrapper from "./ModalWrapper";
import ProfesoresAdmin from "../components/admin/ProfesoresAdmin";
import AgregarMateria from "../components/admin/AgregarMateria";
import AgregarGrupo from "../components/admin/AgregarGrupo";
import GestionarProfesores from "../components/admin/GestionarProfesores";
import GestionarAlumnos from "../components/admin/GestionarAlumnos";
import AlumnosAdmin from "../components/admin/AlumnosAdmin";
import Grupos from "../components/profesor/Grupos";
import ProfesorDashboard from "../pages/Profesor/Dashboard";
import AdminDashboard from "../pages/Admin/Dashboard";
import AlumnoDashboard from "../pages/Alumno/Dashboard";
import ForoFiltrado from "./ForoGlobal";


const DashboardLayout = () => {
  const { role, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [vista, setVista] = useState("inicio");

  const [abrirModalProfesor, setAbrirModalProfesor] = useState(false);
  const [abrirModalMateria, setAbrirModalMateria] = useState(false);
  const [abrirModalGrupo, setAbrirModalGrupo] = useState(false);
  const [abrirModalAlumno, setAbrirModalAlumno] = useState(false);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const grupoAlumno = localStorage.getItem("grupo");
  const token = localStorage.getItem("token");

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [grupoMateria, setGrupoMateria] = useState("");

  useEffect(() => {
    const contenedor = document.getElementById("contenido-scrollable");
    const handleScroll = () => {
      const scrollTop = contenedor?.scrollTop || 0;
      setShowScrollTop(scrollTop > 300);
    };
    if (contenedor) contenedor.addEventListener("scroll", handleScroll);
    return () => {
      if (contenedor) contenedor.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const obtenerNombre = async () => {
      try {
        const res = await fetch(`http://localhost:8000/usuario-info/${usuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNombreCompleto(data.nombre || usuario);
        if (data.tipo === "profesor" && data.materia) {
          setGrupoMateria(`Profesor de ${data.materia}`);
        } else if (data.tipo === "alumno" && data.grupo) {
          setGrupoMateria(`Grupo ${data.grupo}`);
        }
      } catch (error) {
        console.error("Error al obtener info del usuario:", error);
        setNombreCompleto(usuario);
      }
    };
    if (usuario && token) {
      obtenerNombre();
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollToTop = () => {
    const contenedor = document.getElementById("contenido-scrollable");
    if (contenedor) contenedor.scrollTo({ top: 0, behavior: "smooth" });
  };

  const menuItems = {
    admin: [
      { label: "Inicio", icon: <RiBook3Line />, key: "inicio" },
      { label: "Gestionar profesores", icon: <RiUserSettingsLine />, key: "editar-profesores" },
      { label: "Gestionar alumnos", icon: <RiUserSettingsLine />, key: "editar-alumnos" },
      { label: "Agregar profesor", icon: <RiUserSettingsLine />, onClick: () => setAbrirModalProfesor(true) },
      { label: "Agregar materia", icon: <RiBook3Line />, onClick: () => setAbrirModalMateria(true) },
      { label: "Agregar grupo", icon: <RiFolder3Line />, onClick: () => setAbrirModalGrupo(true) },
      { label: "Agregar alumno", icon: <RiUserAddLine />, onClick: () => setAbrirModalAlumno(true) },
      { label: "Foro", icon: <RiChat1Line />, key: "foro" },
    ],
    profesor: [
      { label: "Inicio", icon: <RiBook3Line />, key: "inicio" },
      { label: "Grupos", icon: <RiFolder3Line />, key: "grupos" },
      { label: "Foro", icon: <RiChat1Line />, key: "foro" },
    ],
    alumno: [
      {label: "Inicio", icon: <RiBook3Line />, key: "inicio" },
      { label: "Foro", icon: <RiChat1Line />, key: "foro" },
      { label: "Mis tareas", icon: <RiBook3Line />, key: "tareas" },
      { label: "Calificaciones", icon: <RiAwardLine />, key: "calificaciones" },
      { label: "Material", icon: <RiFolder3Line />, key: "material" },
    ],
  };

  const links = menuItems[role] || [];

  const renderContenido = () => {
  if (role === "profesor") {
    switch (vista) {
      case "grupos":
        return <Grupos />;
      case "foro":
        return <ForoFiltrado role="profesor" usuario={usuario} />;
      case "inicio":
      default:
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#4b1e25]">¡Hola, {nombreCompleto}! 👋</h1>
              {grupoMateria && <p className="text-gray-600 text-sm mt-1">{grupoMateria}</p>}
            </div>
            <ProfesorDashboard />
          </>
        );
    }
  }

  if (role === "alumno") {
  switch (vista) {
    case "foro":
      return (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Foro del grupo:{" "}
            <span className="text-[#4b1e25]">
              {grupoAlumno || "Grupo no definido"}
            </span>
          </h2>
          <ForoFiltrado role="alumno" grupoAlumno={grupoAlumno} />
        </div>
      );

    case "tareas":
      return <h2 className="text-xl font-bold">Mis tareas (próximamente)</h2>;

    case "calificaciones":
      return <h2 className="text-xl font-bold">Mis calificaciones (próximamente)</h2>;

    case "material":
      return <h2 className="text-xl font-bold">Material del curso (próximamente)</h2>;

    case "inicio":
    default:
      return (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#4b1e25]">
              ¡Hola, {nombreCompleto}! 👋
            </h1>
            {grupoMateria && (
              <p className="text-gray-600 text-sm mt-1">{grupoMateria}</p>
            )}
          </div>
          <AlumnoDashboard />
        </>
      );
  }
}


  if (role === "admin") {
  switch (vista) {
    case "editar-profesores":
      return <GestionarProfesores />;
    case "editar-alumnos":
      return <GestionarAlumnos />;
    case "foro":
      return <ForoFiltrado role="admin" />;
    case "inicio":
    default:
      return (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#4b1e25]">
              ¡Hola, {nombreCompleto}! 👋
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Administrador del sistema
            </p>
          </div>
          <AdminDashboard />
        </>
      );
  }
}

  return <h2 className="text-xl font-bold">Rol no compatible</h2>;
};


  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Encabezado móvil */}
      <div className="md:hidden bg-[#4b1e25] text-white px-4 py-3 flex justify-between items-center shadow z-50">
        <h1 className="text-lg font-bold capitalize">Panel {role}</h1>
        <button onClick={() => setShowMenu(!showMenu)} aria-label="Abrir menú">
          {showMenu ? <FcMinus size={24} /> : <FcExpand size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {showMenu && (
        <aside className="md:hidden bg-white text-[#4b1e25] w-full z-40 px-4 py-6 shadow-md">
          <div className="space-y-2">
            {links.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setShowMenu(false);
                  item.onClick ? item.onClick() : setVista(item.key);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-[#4b1e25]/10 transition ${
                  vista === item.key ? "bg-[#4b1e25]/10 font-bold" : ""
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <hr className="my-4 border-[#4b1e25]/30" />
          <div className="space-y-2">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#4b1e25]/10 transition">
              <RiHome2Line /><span>Ir al inicio</span>
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#4b1e25]/10 transition">
              <RiLogoutBoxLine /><span>Cerrar sesión</span>
            </button>
          </div>
        </aside>
      )}

      {/* Sidebar escritorio */}
      <aside className="hidden md:flex flex-col w-64 bg-[#4b1e25] text-white py-6 px-4 shadow-md z-30 justify-between">
        <nav className="flex flex-col gap-2">
          {links.map((item, i) => (
            <button
              key={i}
              onClick={() => (item.onClick ? item.onClick() : setVista(item.key))}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition ${
                vista === item.key ? "bg-white/10 font-bold" : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="flex flex-col items-start gap-2 mt-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition">
            <RiHome2Line /><span>Ir al inicio</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition">
            <RiLogoutBoxLine /><span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main id="contenido-scrollable" className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 md:p-8">
        <div className="max-w-screen-md mx-auto">
          {renderContenido()}
        </div>
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 z-50 bg-[#4b1e25] text-white p-3 rounded-full shadow-lg hover:bg-[#652837] transition"
            aria-label="Volver arriba"
          >
            <RiArrowUpLine size={24} />
          </button>
        )}
      </main>

      {/* Modales */}
      <ModalWrapper isOpen={abrirModalProfesor} onClose={() => setAbrirModalProfesor(false)} title="Agregar nuevo profesor">
        <ProfesoresAdmin isModal={true} />
      </ModalWrapper>
      <ModalWrapper isOpen={abrirModalMateria} onClose={() => setAbrirModalMateria(false)} title="Agregar nueva materia">
        <AgregarMateria isModal={true} />
      </ModalWrapper>
      <ModalWrapper isOpen={abrirModalGrupo} onClose={() => setAbrirModalGrupo(false)} title="Agregar nuevo grupo">
        <AgregarGrupo isModal={true} />
      </ModalWrapper>
      <ModalWrapper isOpen={abrirModalAlumno} onClose={() => setAbrirModalAlumno(false)} title="Agregar nuevo alumno">
        <AlumnosAdmin />
      </ModalWrapper>
    </div>
  );
};

export default DashboardLayout;
