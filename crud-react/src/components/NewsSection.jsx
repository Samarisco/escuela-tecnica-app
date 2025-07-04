import React, { useState } from "react";
import { RiCalendar2Line, RiMegaphoneLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

const news = [
  {
    title: "Inicio del ciclo escolar 2024-2025",
    date: "05 agosto 2024",
    description:
      "El nuevo ciclo escolar inicia el lunes 5 de agosto. ¡Prepárate para una experiencia llena de aprendizaje técnico!",
  },
  {
    title: "Feria de proyectos técnicos",
    date: "20 septiembre 2024",
    description:
      "Alumnos presentarán sus proyectos en áreas de electrónica, programación y mecánica. Abierto a padres y comunidad.",
  },
  {
    title: "Capacitación docente en IA educativa",
    date: "15 octubre 2024",
    description:
      "Nuestro personal docente se capacitará en herramientas de inteligencia artificial aplicadas a la educación secundaria.",
  },
];

const NewsSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="news"
      className=" bg-gray-100 py-12 px-6 xl:px-20 border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-10">
          <RiMegaphoneLine className="text-3xl text-[#4b1e25]" />
          <h2 className="text-3xl font-bold text-[#4b1e25]">
            Noticias recientes
          </h2>
        </div>

        {/* Mobile - Acordeón */}
        <div className="block md:hidden">
          {news.map((item, index) => (
            <div key={index} className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-4 bg-[#4b1e25] text-white text-left font-semibold"
              >
                {item.title}
                {openIndex === index ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
              </button>
              {openIndex === index && (
                <div className="p-4 bg-gray-50 text-sm text-gray-700">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <RiCalendar2Line className="mr-2 text-[#7c4367]" />
                    {item.date}
                  </div>
                  <p>{item.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop - Tarjetas */}
        <div className="hidden md:grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-[#4b1e25]/10 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 relative group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 rounded-t-xl transition-all group-hover:h-1.5"></div>
              <h3 className="text-lg font-semibold text-[#4b1e25] mb-2">
                {item.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <RiCalendar2Line className="mr-2 text-[#7c4367]" />
                {item.date}
              </div>
              <p className="text-gray-700 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
