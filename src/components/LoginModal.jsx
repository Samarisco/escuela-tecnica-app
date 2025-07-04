import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

const LoginModal = ({ isOpen, onClose }) => {
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

            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Numero de Empleado</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4b1e25]"
                  placeholder="501716"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4b1e25]"
                  placeholder="********"
                />
              </div>

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
