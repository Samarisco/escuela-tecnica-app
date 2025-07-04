import { useState } from "react";
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
import ForoFiltrado from "./ForoGlobal";

const DashboardLayout = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [vista, setVista] = useState("inicio");

  const [abrirModalProfesor, setAbrirModalProfesor] = useState(false);
  const [abrirModalMateria, setAbrirModalMateria] = useState(false);
  const [abrirModalGrupo, setAbrirModalGrupo] = useState(false);
  const [abrirModalAlumno, setAbrirModalAlumno] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
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
    ],
    profesor: [
      { label: "Inicio", icon: <RiBook3Line />, key: "inicio" },
      { label: "Grupos", icon: <RiFolder3Line />, key: "grupos" },
      { label: "Foro", icon: <RiChat1Line />, key: "foro" },
    ],
    alumno: [
      { label: "Foro", icon: <RiChat1Line />, key: "foro" },
      { label: "Mis tareas", icon: <RiBook3Line />, key: "tareas" },
      { label: "Calificaciones", icon: <RiAwardLine />, key: "calificaciones" },
      { label: "Material", icon: <RiFolder3Line />, key: "material" },
    ],
  };

  const links = menuItems[role] || [];

  const renderContenido = () => {
    const usuario = localStorage.getItem("usuario");
    const grupoAlumno = localStorage.getItem("grupo"); // 👈 Asegúrate de guardar esto al loguear al alumno

    if (role === "profesor") {
      switch (vista) {
        case "grupos":
          return <Grupos />;
        case "foro":
          return <ForoFiltrado role="profesor" usuario={usuario} />;
        case "inicio":
        default:
          return <ProfesorDashboard />;
      }
    }

    if (role === "alumno") {
  switch (vista) {
    case "foro":
      return (
        <div>
          <h1 className="text-xl font-bold mb-4">
            Foro del grupo: <span className="text-[#4b1e25]">{grupoAlumno || "Grupo no definido"}</span>
          </h1>
          <ForoFiltrado role="alumno" grupoAlumno={grupoAlumno} />
        </div>
      );
    case "tareas":
      return <h1 className="text-xl font-bold">Mis tareas (próximamente)</h1>;
    case "calificaciones":
      return <h1 className="text-xl font-bold">Mis calificaciones (próximamente)</h1>;
    case "material":
      return <h1 className="text-xl font-bold">Material del curso (próximamente)</h1>;
    default:
      return (
        <h1 className="text-xl font-bold">
          Bienvenido, Alumno del grupo <span className="text-[#4b1e25]">{grupoAlumno || "Grupo no definido"}</span>
        </h1>
      );
  }
}

    if (role === "admin") {
      switch (vista) {
        case "editar-profesores":
          return <GestionarProfesores />;
        case "editar-alumnos":
          return <GestionarAlumnos />;
        default:
          return <h1 className="text-xl font-bold">Bienvenido, Administrador</h1>;
      }
    }

    return <div><h2 className="text-xl font-bold">Rol no compatible</h2></div>;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Encabezado móvil */}
      <div className="md:hidden bg-[#4b1e25] text-white px-4 py-3 flex justify-between items-center shadow z-50">
        <h1 className="text-lg font-bold capitalize">Panel {role}</h1>
        <button onClick={() => setShowMenu(!showMenu)} aria-label="Abrir menú">
          {showMenu ? <FcMinus size={24} /> : <FcExpand size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {showMenu && (
        <aside className="md:hidden bg-[#4b1e25] text-white w-full z-40 px-4 py-6 space-y-2 shadow-md">
          {links.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setShowMenu(false);
                item.onClick ? item.onClick() : setVista(item.key);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition ${
                vista === item.key ? "bg-white/10 font-bold" : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition">
            <RiHome2Line /><span>Ir al inicio</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition">
            <RiLogoutBoxLine /><span>Cerrar sesión</span>
          </button>
        </aside>
      )}

      {/* Sidebar escritorio */}
      <aside className="hidden md:flex flex-col w-64 bg-[#4b1e25] text-white py-6 px-4 shadow-md z-30">
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
          <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition">
            <RiHome2Line /><span>Ir al inicio</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition">
            <RiLogoutBoxLine /><span>Cerrar sesión</span>
          </button>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-4 md:p-8 bg-gray-50 overflow-y-auto">
        {renderContenido()}
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
