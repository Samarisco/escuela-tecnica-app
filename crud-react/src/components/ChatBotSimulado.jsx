import { useState } from "react";
import { RiCloseLine, RiSendPlane2Line, RiMessage3Fill } from "react-icons/ri";

export default function ChatBotSimulado() {
  const [mostrarChat, setMostrarChat] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const toggleChat = () => setMostrarChat(!mostrarChat);

  const enviarMensaje = () => {
    setMensaje("");
    // Aquí va la lógica futura
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Ventana del chat */}
      {mostrarChat && (
        <div className="bg-white shadow-2xl rounded-2xl w-[90vw] sm:w-[28rem] h-[80vh] p-4 sm:p-6 border border-[#7c4367] flex flex-col justify-between">
          {/* Encabezado */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#7c4367] font-bold text-xl sm:text-2xl">
                Asistente Virtual
              </h2>
              <button
                onClick={toggleChat}
                className="text-[#7c4367] hover:text-red-500"
              >
                <RiCloseLine size={28} />
              </button>
            </div>
            <div className="text-base sm:text-lg text-gray-700 leading-relaxed">
              ¡Hola! Soy el asistente virtual. 🚀 <br />
              Esta función estará disponible próximamente.
            </div>
          </div>

          {/* Campo de entrada */}
          <div className="flex items-center gap-3 mt-6">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className="flex-1 p-2 sm:p-3 border rounded-lg text-base sm:text-lg"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
            <button
              onClick={enviarMensaje}
              className="text-[#7c4367] hover:text-yellow-400"
            >
              <RiSendPlane2Line size={28} />
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      {!mostrarChat && (
        <button
          onClick={toggleChat}
          type="button"
          className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-[#7c4367] hover:bg-yellow-400 text-white rounded-full shadow-2xl transition"
        >
          <RiMessage3Fill size={28} />
        </button>
      )}
    </div>
  );
}
