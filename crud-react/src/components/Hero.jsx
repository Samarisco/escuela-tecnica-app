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
      className="min-h-[75vh] flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4 sm:px-8 py-16"
    >
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-6 md:p-12 grid grid-cols-1 xl:grid-cols-8 gap-10 transition">
        {/* Texto dinámico */}
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
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#4b1e25] tracking-tight">
                {title}
              </h1>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {description}
              </p>

              {section !== "inicio" && (
                <a
                  href="#contacto"
                  className="bg-[#4b1e25] text-white py-3 px-6 rounded-xl text-base md:text-lg hover:bg-yellow-400 hover:text-[#4b1e25] transition-colors font-semibold w-fit shadow-md"
                >
                  {button}
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Imagen + tarjeta */}
        <div className="xl:col-span-3 flex justify-center relative">
          <div className="relative flex flex-col items-center">
            {/* Imagen circular */}
            <div className="w-[230px] sm:w-[270px] md:w-[300px] aspect-square rounded-full border-[6px] border-[#4b1e25] bg-white relative z-10 overflow-hidden shadow-xl hover:scale-105 transition-transform duration-500">
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

            {/* Tarjeta sobrepuesta */}
            <div className="w-[90%] max-w-xs bg-white shadow-lg rounded-2xl px-5 py-5 text-center border-t-4 border-yellow-400 -mt-6 z-20 backdrop-blur-sm bg-opacity-80">
              <h3 className="text-lg font-bold text-[#4b1e25] mb-1">{label}</h3>
              <p className="text-gray-600 text-sm">{sub}</p>
              <div className="flex justify-center gap-3 mt-3 text-xl">
                <FcGraduationCap />
                <FcBusinessContact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
