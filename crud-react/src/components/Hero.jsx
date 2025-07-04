import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGraduationCap, FcBusinessContact } from "react-icons/fc";

const Hero = ({ section }) => {
  const heroText = {
    inicio: {
      title: "Formación técnica para el futuro",
      description:
        "Un espacio donde la tecnología, el conocimiento y la práctica se unen para transformar el aprendizaje de los jóvenes.",
      button: "Contáctanos",
    },
    vision: {
      title: "Nuestra visión",
      description:
        "Ser una institución de excelencia que forme jóvenes líderes en el ámbito técnico y humano.",
      button: "Explorar visión",
    },
    mision: {
      title: "Nuestra misión",
      description:
        "Brindar educación secundaria técnica de calidad, enfocada en el desarrollo de habilidades prácticas y valores.",
      button: "Ver más",
    },
    contacto: {
      title: "Contáctanos",
      description:
        "Estamos para ayudarte. Comunícate con nosotros a través del formulario o redes sociales.",
      button: "Ir al formulario",
    },
  };

  const imageData = {
    inicio: {
      img: "/img/alumnosdemo.jpg",
      label: "+900 estudiantes inscritos",
      sub: "Educación técnica con enfoque práctico y digital",
    },
    vision: {
      img: "/img/vision.jpg",
      label: "Construyendo un mejor futuro",
      sub: "Formando líderes con visión técnica y humana",
    },
    mision: {
      img: "/img/mision.jpg",
      label: "Comprometidos con tu formación",
      sub: "Enseñanza integral con valores y tecnología",
    },
    contacto: {
      img: "/img/contacto.png",
      label: "¿Tienes dudas?",
      sub: "Estamos para escucharte y ayudarte",
    },
  };

  const { title, description, button } = heroText[section] || heroText.inicio;
  const { img, label, sub } = imageData[section] || imageData.inicio;

  return (
    <section
      id="home"
      className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br px-4 sm:px-8 py-12"
    >
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-3xl p-6 md:p-10 grid grid-cols-1 xl:grid-cols-8 gap-10">
        {/* Texto principal dinámico */}
        <div className="xl:col-span-5 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight text-[#4b1e25]">
                {title}
              </h1>
              <p className="text-gray-700 text-base md:text-lg">{description}</p>

              {section !== "inicio" && (
                <a
                  href="#contacto"
                  className="bg-[#4b1e25] text-white py-2 px-6 rounded-xl text-base hover:bg-[#7c4367] transition w-fit"
                >
                  {button}
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Imagen circular + descripción dinámica */}
        <div className="xl:col-span-3 flex justify-center relative">
          <div className="relative flex flex-col items-center">
            {/* Marco circular */}
            <div className="w-[220px] sm:w-[260px] md:w-[300px] aspect-square rounded-full border-[6px] border-[#4b1e25] bg-white relative z-10 overflow-hidden shadow-lg">
              <motion.img
                key={img}
                src={img}
                alt={label}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 object-cover w-full h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Tarjeta encimada */}
            <div className="w-[90%] max-w-xs bg-white shadow-md rounded-xl px-4 py-4 text-center border-t-4 border-yellow-400 -mt-6 z-20">
              <h3 className="text-base sm:text-lg font-bold text-[#4b1e25] mb-2">
                {label}
              </h3>
              <p className="text-gray-600 text-sm">{sub}</p>
              <div className="flex justify-center gap-3 mt-3">
                <FcGraduationCap size={22} />
                <FcBusinessContact size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
