import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FcBookmark, FcExpand, FcMinus } from "react-icons/fc";
import {
  RiUser3Line,
  RiHome2Line,
  RiEyeLine,
  RiFlagLine,
  RiPhoneLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";

const Header = ({ setSection, openLogin }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { role } = useAuth();

  const handleMenuClick = (section) => {
    setSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowMenu(false);
  };

  const getPanelUrl = () => {
    switch (role) {
      case "admin":
        return "/admin";
      case "profesor":
        return "/profesor";
      case "alumno":
        return "/alumno";
      default:
        return "#";
    }
  };

  const renderLoginIcon = () =>
    role ? (
      <Link
        to={getPanelUrl()}
        className="hover:text-yellow-400 text-xl transition"
        title="Ir al panel"
        aria-label="Panel del usuario"
      >
        <div className="p-2 rounded-full border border-white hover:border-yellow-400">
          <RiUser3Line />
        </div>
      </Link>
    ) : (
      <button
        onClick={openLogin}
        className="hover:text-yellow-400 text-xl transition"
        title="Iniciar sesión"
        aria-label="Iniciar sesión"
      >
        <div className="p-2 rounded-full border border-white hover:border-yellow-400">
          <RiUser3Line />
        </div>
      </button>
    );

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-[#4b1e25] text-white shadow-md z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <button
            onClick={() => handleMenuClick("inicio")}
            className="flex items-center gap-2 bg-white text-[#4b1e25] font-bold text-xl px-3 py-1 rounded-lg shadow-sm hover:scale-105 transition-transform"
            aria-label="Ir al inicio"
          >
            <FcBookmark size={26} />
            INSTITUCIÓN
          </button>

          {/* Botón menú móvil */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="xl:hidden text-2xl text-white p-2 focus:outline-none"
            aria-label="Abrir menú"
          >
            {showMenu ? <FcMinus /> : <FcExpand />}
          </button>

          {/* Menú escritorio */}
          <div className="hidden xl:flex gap-10 items-center text-base font-semibold tracking-wide">
            <button
              onClick={() => handleMenuClick("inicio")}
              className="hover:text-yellow-400 transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => handleMenuClick("vision")}
              className="hover:text-yellow-400 transition-colors"
            >
              Visión
            </button>
            <button
              onClick={() => handleMenuClick("mision")}
              className="hover:text-yellow-400 transition-colors"
            >
              Misión
            </button>
            <button
              onClick={() => handleMenuClick("contacto")}
              className="hover:text-yellow-400 transition-colors"
            >
              Contacto
            </button>
            {renderLoginIcon()}
          </div>
        </div>

        {/* Menú móvil */}
        <nav
          className={`xl:hidden fixed top-[64px] left-0 w-full bg-white text-[#4b1e25] shadow-md transition-all duration-500 ease-in-out overflow-hidden ${
            showMenu ? "max-h-[400px] py-6" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col items-center gap-6 font-medium text-lg">
            <li>
              <button
                onClick={() => handleMenuClick("inicio")}
                className="flex items-center gap-2 hover:text-yellow-500 transition"
              >
                <RiHome2Line className="text-xl" />
                Inicio
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick("vision")}
                className="flex items-center gap-2 hover:text-yellow-500 transition"
              >
                <RiEyeLine className="text-xl" />
                Visión
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick("mision")}
                className="flex items-center gap-2 hover:text-yellow-500 transition"
              >
                <RiFlagLine className="text-xl" />
                Misión
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick("contacto")}
                className="flex items-center gap-2 hover:text-yellow-500 transition"
              >
                <RiPhoneLine className="text-xl" />
                Contacto
              </button>
            </li>
            <li>
              {role ? (
                <Link
                  to={getPanelUrl()}
                  className="flex items-center gap-2 hover:text-yellow-500 transition"
                  aria-label="Ir al panel"
                >
                  <RiUser3Line className="text-xl" />
                  Panel
                </Link>
              ) : (
                <button
                  onClick={openLogin}
                  className="flex items-center gap-2 hover:text-yellow-500 transition"
                  aria-label="Iniciar sesión"
                >
                  <RiUser3Line className="text-xl" />
                  Iniciar sesión
                </button>
              )}
            </li>
          </ul>
        </nav>
      </header>

      {/* Gradiente decorativo */}
      <div className="h-4 bg-gradient-to-b from-[#4b1e25] to-transparent w-full z-40 relative" />
    </>
  );
};

export default Header;
