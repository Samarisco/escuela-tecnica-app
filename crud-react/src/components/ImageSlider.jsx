import React, { useState, useEffect, useRef } from "react";
import { FcNext, FcPrevious } from "react-icons/fc";

const images = [
  {
    src: "/img/slider1.png",
    caption: "Actividades escolares y técnicas",
  },
  {
    src: "/img/slider2.jpg",
    caption: "Proyectos de alumnos en taller",
  },
  {
    src: "/img/slider3.jpg",
    caption: "Eventos académicos y culturales",
  },
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Autoplay cada 5s sin conflicto con botones
  useEffect(() => {
    timeoutRef.current = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  return (
    <section className="w-full max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6">
      {/* Texto institucional */}
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#4b1e25]">
          Actividades destacadas
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Compartimos con orgullo momentos importantes de nuestra comunidad educativa:
          actividades técnicas, culturales y académicas.
        </p>
        <a
          href="#contacto"
          className="inline-block bg-[#7c4367] text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-[#4b1e25] transition-colors shadow-md w-fit"
        >
          Ver más detalles
        </a>
      </div>

      {/* Slider cuadrado tipo Instagram */}
      <div className="relative aspect-square w-full max-w-[420px] mx-auto overflow-hidden rounded-2xl shadow-2xl bg-white group">
        {/* Imagen */}
        <img
          key={images[currentIndex].src}
          src={images[currentIndex].src}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
        />

        {/* Caption con fondo fade oscuro arriba */}
        <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#4b1e25]/90 to-transparent text-white p-4 z-20">
          <h3 className="text-lg font-semibold drop-shadow-sm">
            {images[currentIndex].caption}
          </h3>
        </div>

        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-white text-[#4b1e25] hover:bg-[#7c4367] hover:text-white transition p-2 rounded-full shadow-lg z-30"
          aria-label="Anterior"
        >
          <FcPrevious size={28} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-white text-[#4b1e25] hover:bg-[#7c4367] hover:text-white transition p-2 rounded-full shadow-lg z-30"
          aria-label="Siguiente"
        >
          <FcNext size={28} />
        </button>

        {/* Dots indicadores (abajo, separados del texto) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === currentIndex ? "bg-yellow-400" : "bg-white/60"
              } transition duration-300`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
