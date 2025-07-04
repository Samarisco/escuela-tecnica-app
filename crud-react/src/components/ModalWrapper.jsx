// ✅ ModalWrapper.jsx actualizado con barra enriquecida
import { motion, AnimatePresence } from "framer-motion";
import {
  RiCloseLine,
  RiImageAddLine,
  RiAttachment2,
  RiEmotionLine,
  RiBold,
  RiItalic,
  RiLink,
  RiFontSize2,
  RiAlignCenter,
  RiDeleteBinLine
} from "react-icons/ri";

export default function ModalWrapper({ isOpen, onClose, title, showToolbar = false, children }) {
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
            className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-2xl relative"
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

            {title && (
              <h2 className="text-2xl font-bold text-[#4b1e25] mb-4 text-center">
                {title}
              </h2>
            )}

            {/* 🔧 Barra enriquecida opcional */}
            {showToolbar && (
              <div className="flex flex-wrap gap-2 justify-start mb-4 text-xl text-gray-600 px-1">
                <label htmlFor="input-imagen" title="Insertar imagen" className="cursor-pointer">
                  <RiImageAddLine />
                </label>
                <label htmlFor="input-archivo" title="Adjuntar archivo" className="cursor-pointer">
                  <RiAttachment2 />
                </label>
                <button type="button" title="Emojis"><RiEmotionLine /></button>
                <button type="button" title="Negrita"><RiBold /></button>
                <button type="button" title="Cursiva"><RiItalic /></button>
                <button type="button" title="Insertar enlace"><RiLink /></button>
                <button type="button" title="Tamaño de fuente"><RiFontSize2 /></button>
                <button type="button" title="Alinear texto"><RiAlignCenter /></button>
                <button type="button" title="Borrar formato"><RiDeleteBinLine /></button>
              </div>
            )}

            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
