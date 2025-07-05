import { motion, AnimatePresence } from "framer-motion";
import {
  RiCloseLine,
  RiImageAddLine,
  RiAttachment2
} from "react-icons/ri";
import { useRef } from "react";

export default function ModalForo({
  isOpen,
  onClose,
  title,
  showToolbar = false,
  children,
  onImageChange,
  onFileChange,
  onSubmit
}) {
  const dropRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-[95%] max-w-2xl border-t-4 border-yellow-400"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#4b1e25] hover:text-yellow-500 text-2xl"
              aria-label="Cerrar modal"
            >
              <RiCloseLine />
            </button>

            {/* Título */}
            {title && (
              <div className="mb-4 border-b pb-3 text-center">
                <h2 className="text-2xl font-bold text-[#4b1e25]">
                  {title}
                </h2>
              </div>
            )}

            {/* Contenido */}
            <div className="space-y-4">{children}</div>

            {/* Barra de herramientas */}
            {showToolbar && (
              <div className="mt-6 flex justify-around items-center border rounded-lg p-4 bg-gray-100">
                {/* Imagen */}
                <label
                  htmlFor="input-imagen"
                  className="cursor-pointer flex flex-col items-center text-[#4b1e25] hover:text-yellow-500 transition"
                >
                  <RiImageAddLine className="text-2xl" />
                  <span className="text-xs mt-1">Imagen</span>
                </label>
                <input
                  id="input-imagen"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onImageChange) onImageChange(file);
                  }}
                />

                {/* Archivo */}
                <label
                  htmlFor="input-archivo"
                  className="cursor-pointer flex flex-col items-center text-[#4b1e25] hover:text-yellow-500 transition"
                >
                  <RiAttachment2 className="text-2xl" />
                  <span className="text-xs mt-1">Archivo</span>
                </label>
                <input
                  id="input-archivo"
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onFileChange) onFileChange(file);
                  }}
                />
              </div>
            )}

            {/* Botón publicar */}
            {onSubmit && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onSubmit}
                  className="bg-[#4b1e25] hover:bg-yellow-400 hover:text-black text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                >
                  Publicar
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
