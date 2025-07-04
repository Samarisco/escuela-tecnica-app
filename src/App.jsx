import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ImageSlider from "./components/ImageSlider";
import NewsSection from "./components/NewsSection";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";

function App() {
  const [section, setSection] = useState("inicio");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="bg-gray-100 font-sans overflow-x-hidden">
      <Header setSection={setSection} openLogin={() => setIsLoginOpen(true)} />

      {/* ✅ Hero siempre presente, cambia internamente */}
      <section className="pt-8 xl:pt-12 pb-10">
        <Hero section={section} />
      </section>

      {/* ✅ Solo visible en la sección de inicio */}
      {section === "inicio" && (
        <>
          <section className="pt-4 xl:pt-10 pb-10 bg-white">
            <ImageSlider />
          </section>

          <section className="pt-4 xl:pt-10 pb-10 bg-white">
            <NewsSection />
          </section>
        </>
      )}

      {/* Footer siempre visible */}
      <Footer />

      {/* Modal de login */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default App;
