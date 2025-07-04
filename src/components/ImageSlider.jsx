import React, { useState, useEffect } from "react";
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

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  // Autoplay cada 5s
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="w-full max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
      {/* Texto institucional */}
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#4b1e25]">
          Actividades destacadas
        </h2>
        <p className="text-gray-700 text-lg">
          Compartimos con orgullo momentos importantes de nuestra comunidad educativa:
          actividades técnicas, culturales y académicas.
        </p>
        <a
          href="#contacto"
          className="inline-block bg-[#7c4367] text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Ver más detalles
        </a>
      </div>

      {/* Slider cuadrado tipo Instagram */}
      <div className="relative aspect-square w-full max-w-[400px] mx-auto overflow-hidden rounded-xl shadow-lg bg-white">
        <img
          src={images[currentIndex].src}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Fade + caption */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#4b1e25]/90 to-transparent text-white p-4">
          <h3 className="text-lg font-semibold">{images[currentIndex].caption}</h3>
        </div>

        {/* Botones */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-[#7c4367] text-[#4b1e25] p-2 rounded-full shadow"
        >
          <FcPrevious size={28} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-[#7c4367] text-[#4b1e25] p-2 rounded-full shadow"
        >
          <FcNext size={28} />
        </button>
      </div>
    </section>
  );
};

export default ImageSlider;
