import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

export default function ModalWrapper({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white border-t-4 border-yellow-400 rounded-xl shadow-2xl p-6 pt-8 w-[95%] max-w-2xl"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Botón cerrar fuera del header */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 bg-white text-[#4b1e25] hover:text-red-500 rounded-full p-2 shadow transition z-10"
              aria-label="Cerrar modal"
            >
              <RiCloseLine size={24} />
            </button>

            {/* Título */}
            {title && (
              <div className="mb-4 bg-[#4b1e25] text-white px-4 py-2 rounded-lg shadow text-center">
                <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
              </div>
            )}

            {/* Contenido */}
            <div className="text-gray-800">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
