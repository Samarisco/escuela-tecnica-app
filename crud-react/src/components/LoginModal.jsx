import { useState } from "react";
import { login } from "../services/authService";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose }) => {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login: loginToContext } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(employeeNumber, password);

      // ✅ Guardar token en contexto y localStorage
      loginToContext(result.role, result.usuario, result.access_token);
      localStorage.setItem("token", result.access_token); // 🔐 necesario para peticiones protegidas
      alert(`¡Bienvenido ${result.usuario}!`);

      // 🔍 Obtener información adicional si es alumno
      if (result.role === "alumno") {
        const res = await fetch(`http://localhost:8000/usuario-info/${employeeNumber}`, {
          headers: {
            Authorization: `Bearer ${result.access_token}`,
          },
        });
        const data = await res.json();
        if (data && data.grupo) {
          localStorage.setItem("grupo", data.grupo);
        }
      }

      onClose();

      // Redirección por rol
      if (result.role === "admin") navigate("/admin");
      else if (result.role === "profesor") navigate("/profesor");
      else if (result.role === "alumno") navigate("/alumno");

    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              aria-label="Cerrar modal"
            >
              <RiCloseLine />
            </button>

            <h2 className="text-2xl font-bold text-[#4b1e25] mb-4 text-center">
              Iniciar sesión
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  inputMode="text"
                  autoComplete="username"
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4b1e25]"
                  placeholder="gutierreza"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#4b1e25]"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#4b1e25]"
                  >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="bg-[#4b1e25] text-white py-2 rounded-lg hover:bg-[#7c4367] transition"
              >
                Entrar
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
