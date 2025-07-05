import React from "react";
import {
  RiInstagramLine,
  RiFacebookLine,
  RiTwitterLine,
  RiGithubLine,
} from "react-icons/ri";

const token = localStorage.getItem("token");

const Footer = () => {
  return (
    <footer className="bg-[#4b1e25] p-8 xl:p-20 text-white">
      {/* Parte superior: logo + redes */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-600 pb-8">
        {/* Logo centrado en móvil */}
        <div className="flex justify-center md:justify-start w-full md:w-auto">
          <a
            href="#"
            className="text-2xl font-bold relative p-1 bg-white text-[#4b1e25] rounded-md px-4"
          >
            INSTITUCIÓN
          </a>
        </div>

        {/* Redes sociales */}
        <nav className="flex items-center gap-4 justify-center md:justify-end w-full md:w-auto">
          <a href="#" className="block p-3 bg-[#7c4367] rounded-full hover:bg-yellow-400 transition">
            <RiInstagramLine />
          </a>
          <a href="#" className="block p-3 bg-[#7c4367] rounded-full hover:bg-yellow-400 transition">
            <RiFacebookLine />
          </a>
          <a href="#" className="block p-3 bg-[#7c4367] rounded-full hover:bg-yellow-400 transition">
            <RiTwitterLine />
          </a>
          <a href="#" className="block p-3 bg-[#7c4367] rounded-full hover:bg-yellow-400 transition">
            <RiGithubLine />
          </a>
        </nav>
      </div>

      {/* Enlaces institucionales */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-center md:text-left">
          Enlaces útiles
        </h3>
        <nav className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 flex-wrap">
          <a href="#home" className="text-gray-300 hover:text-white transition">
            Inicio
          </a>
          <a href="#vision" className="text-gray-300 hover:text-white transition">
            Visión
          </a>
          <a href="#mision" className="text-gray-300 hover:text-white transition">
            Misión
          </a>
          <a href="#oferta" className="text-gray-300 hover:text-white transition">
            Oferta educativa
          </a>
          <a href="#avisos" className="text-gray-300 hover:text-white transition">
            Avisos
          </a>
          <a href="#contacto" className="text-gray-300 hover:text-white transition">
            Contacto
          </a>
          <button
            type="button"
            className="font-semibold py-2 px-6 bg-[#7c4367] hover:bg-yellow-400 transition text-white rounded-xl"
          >
            Escribir mensaje
          </button>
        </nav>
      </div>

      {/* Créditos */}
      <div className="mt-16 text-center">
        <p className="text-gray-300 text-sm">
          © {new Date().getFullYear()} - Todos los derechos reservados
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Sitio institucional en desarrollo con fines educativos
        </p>
      </div>
    </footer>
  );
};

export default Footer;
