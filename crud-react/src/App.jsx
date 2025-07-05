import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ImageSlider from "./components/ImageSlider";
import NewsSection from "./components/NewsSection";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import PrivateRoute from "./components/PrivateRoute";
import ChatBotSimulado from "./components/ChatBotSimulado";

// Vistas por rol
import AdminDashboard from "./pages/Admin/Dashboard";
import AlumnoDashboard from "./pages/Alumno/Dashboard";

// Layout dinámico del profesor
import DashboardLayout from "./components/DashboardLayout";

// Página para usuarios sin permisos
import Unauthorized from "./pages/Unauthorized";

function App() {
  const [section, setSection] = useState("inicio");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Página principal pública */}
        <Route
          path="/"
          element={
            <div className="bg-gray-100 font-sans overflow-x-hidden">
              <Header
                setSection={setSection}
                openLogin={() => setIsLoginOpen(true)}
              />

              {/* HERO SIEMPRE PRESENTE */}
              <section className="pt-8 xl:pt-12 pb-10">
                <Hero section={section} />
              </section>

              {/* ESTAS SECCIONES SIEMPRE VISIBLES */}
              <section className="pt-4 xl:pt-10 pb-10 bg-white">
                <ImageSlider />
              </section>

              <section className="pt-4 xl:pt-10 pb-10 bg-white">
                <NewsSection />
              </section>

              <Footer />
              <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
              />
            </div>
          }
        />

        {/* Ruta para administrador */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <DashboardLayout />
            </PrivateRoute>
          }
        />

        {/* Ruta para profesor */}
        <Route
          path="/profesor"
          element={
            <PrivateRoute allowedRoles={["profesor"]}>
              <DashboardLayout />
            </PrivateRoute>
          }
        />

        {/* Ruta para alumno */}
        <Route
          path="/alumno"
          element={
            <PrivateRoute allowedRoles={["alumno"]}>
              <DashboardLayout />
            </PrivateRoute>
          }
        />

        {/* Ruta para acceso no autorizado */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>

      {/* Este componente está fuera de las rutas, así que aparece en TODA la app */}
      <ChatBotSimulado />
    </Router>
  );
}

export default App;
