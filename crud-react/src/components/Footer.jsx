import React from "react";
import {
  RiInstagramLine,
  RiFacebookLine,
  RiTwitterLine,
  RiGithubLine,
} from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-[#4b1e25] text-white px-6 py-12 sm:px-10 xl:px-20 shadow-inner">
      {/* Parte superior: Logo + redes */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-10">
        {/* Logo */}
        <div className="text-center md:text-left">
          <a
            href="#"
            className="text-2xl font-extrabold bg-white text-[#4b1e25] px-4 py-2 rounded-xl shadow hover:scale-105 transition-transform inline-block"
          >
            INSTITUCIÓN
          </a>
        </div>

        {/* Redes sociales */}
        <nav className="flex gap-4">
          {[
            { icon: <RiInstagramLine />, href: "#" },
            { icon: <RiFacebookLine />, href: "#" },
            { icon: <RiTwitterLine />, href: "#" },
            { icon: <RiGithubLine />, href: "#" },
          ].map(({ icon, href }, idx) => (
            <a
              key={idx}
              href={href}
              className="p-3 bg-[#7c4367] hover:bg-yellow-400 text-white hover:text-[#4b1e25] rounded-full transition-all shadow-md hover:scale-110"
            >
              {icon}
            </a>
          ))}
        </nav>
      </div>

      {/* Enlaces institucionales */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-center md:text-left mb-4">
          Enlaces útiles
        </h3>
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-300 text-sm font-medium flex-wrap">
          <a
            href="#oferta"
            className="hover:text-white transition-colors duration-300"
          >
            Oferta educativa
          </a>
          <a
            href="#avisos"
            className="hover:text-white transition-colors duration-300"
          >
            Avisos
          </a>
          <a
            href="#contacto"
            className="hover:text-white transition-colors duration-300"
          >
            Contacto
          </a>
        </nav>
      </div>

      {/* Créditos */}
      <div className="mt-14 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} - Todos los derechos reservados</p>
        <p className="text-xs mt-1 italic">
          Sitio institucional en desarrollo con fines educativos
        </p>
      </div>
    </footer>
  );
};

export default Footer;
