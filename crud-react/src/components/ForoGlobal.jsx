import { useEffect, useState } from "react";
import {
  RiAddLine,
  RiFileAddLine,
  RiChat1Line,
  RiAttachment2,
  RiEmotionLine,
  RiBold,
  RiItalic,
  RiLink,
  RiFontSize2,
  RiAlignCenter,
  RiDeleteBinLine,
} from "react-icons/ri";
import ModalWrapper from "./ModalWrapper";

export default function ForoGlobal() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  const usuario = localStorage.getItem("usuario");
  const rol = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/foro-global")
      .then((res) => res.json())
      .then(async (data) => {
        const autoresDePublicaciones = data.map((p) => p.autor);
        const autoresDeComentarios = data.flatMap((p) => (p.comentarios || []).map((c) => c.autor));
        const autoresUnicos = [...new Set([...autoresDePublicaciones, ...autoresDeComentarios])];

        const infoAutores = {};
        for (const autor of autoresUnicos) {
          try {
            const res = await fetch(`http://localhost:8000/usuario-info/${autor}`);
            const datos = await res.json();
            infoAutores[autor] = datos;
          } catch {
            infoAutores[autor] = { tipo: "desconocido", nombre: autor };
          }
        }

        const publicacionesConInfo = data.map((pub) => ({
          ...pub,
          autorInfo: infoAutores[pub.autor],
          nuevoComentario: "",
          comentarioVisible: false,
          imagen: null,
          archivo: null,
          comentarios: pub.comentarios.map((c) => ({
            ...c,
            autorInfo: infoAutores[c.autor],
          })),
        }));

        setPublicaciones(publicacionesConInfo);
      })
      .catch(() => setPublicaciones([]));
  }, []);

  const publicar = async () => {
    if (!titulo || !contenido) return;

    const payload = {
      titulo,
      contenido,
      autor: usuario,
      archivo_url: null,
      imagen_url: null,
    };

    try {
      const res = await fetch("http://localhost:8000/foro-global", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setPublicaciones([
          {
            ...data,
            nuevoComentario: "",
            comentarioVisible: false,
            comentarios: [],
            imagen: null,
            archivo: null,
          },
          ...publicaciones,
        ]);
        setMostrarFormulario(false);
        setTitulo("");
        setContenido("");
      } else {
        console.error("Error al publicar:", res.status);
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
    }
  };

  const enviarComentario = async (publicacionId) => {
    const publicacion = publicaciones.find((p) => p.id === publicacionId);
    const texto = publicacion?.nuevoComentario?.trim();
    if (!texto) return;

    const comentario = {
      publicacion_id: publicacionId,
      autor: usuario,
      contenido: texto,
    };

    try {
      const res = await fetch("http://localhost:8000/foro-global/comentario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comentario),
      });

      if (res.ok) {
        const nuevoComentario = await res.json();
        const autorInfo = publicacion.autorInfo;
        setPublicaciones((prev) =>
          prev.map((p) =>
            p.id === publicacionId
              ? {
                  ...p,
                  nuevoComentario: "",
                  comentarioVisible: false,
                  comentarios: [
                    ...(p.comentarios || []),
                    { ...nuevoComentario, autorInfo },
                  ],
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error al comentar:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📢 Foro Global</h1>
        {rol === "profesor" && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="flex items-center gap-2 bg-[#4b1e25] text-white px-4 py-2 rounded hover:bg-[#652837]"
          >
            <RiAddLine /> Crear publicación
          </button>
        )}
      </div>

      <div className="space-y-6">
        {publicaciones.map((pub) => (
          <div
            key={pub.id}
            className="bg-white shadow p-4 rounded border border-gray-200"
          >
            <h3 className="text-xl font-bold">{pub.titulo}</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{pub.contenido}</p>

            {pub.imagen_url && (
              <img
                src={`http://localhost:8000/${pub.imagen_url}`}
                alt="Imagen"
                className="mt-3 w-full max-h-80 object-contain rounded"
              />
            )}

            {pub.archivo_url && (
              <a
                href={`http://localhost:8000/${pub.archivo_url}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm mt-2 flex items-center"
              >
                <RiFileAddLine className="mr-1" /> Ver archivo adjunto
              </a>
            )}

            <div className="text-sm text-gray-500 mt-2">
              Publicado por <strong>{pub.autorInfo?.nombre || pub.autor}</strong>
              {pub.autorInfo?.tipo === "profesor" && (
                <span className="ml-1 text-xs text-gray-600">(Profesor/a de {pub.autorInfo.materia})</span>
              )}
              {pub.autorInfo?.tipo === "alumno" && (
                <span className="ml-1 text-xs text-gray-600">(Alumno de {pub.autorInfo.grupo})</span>
              )}
              • {new Date(pub.fecha).toLocaleString()}
            </div>

            <div className="mt-4 border-t pt-2">
              <h4 className="text-md font-semibold mb-2 flex items-center gap-1">
                <RiChat1Line /> Comentarios
              </h4>
              {pub.comentarios?.length > 0 ? (
                pub.comentarios.map((com, i) => (
                  <div key={i} className="text-sm border-b py-1">
                    <strong>{com.autorInfo?.nombre || com.autor}</strong>
                    {com.autorInfo?.tipo === "profesor" && (
                      <span className="text-xs text-gray-600"> (Profesor/a de {com.autorInfo.materia})</span>
                    )}
                    {com.autorInfo?.tipo === "alumno" && (
                      <span className="text-xs text-gray-600"> (Alumno de {com.autorInfo.grupo})</span>
                    )}
                    : {com.contenido}{" "}
                    <span className="text-gray-500 text-xs">({new Date(com.fecha).toLocaleString()})</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Sin comentarios.</p>
              )}

              <button
                onClick={() =>
                  setPublicaciones((prev) =>
                    prev.map((p) =>
                      p.id === pub.id
                        ? { ...p, comentarioVisible: true }
                        : { ...p, comentarioVisible: false }
                    )
                  )
                }
                className="mt-3 bg-[#4b1e25] text-white px-3 py-1 rounded hover:bg-[#652837]"
              >
                Agregar comentario
              </button>

              {pub.comentarioVisible && (
                <ModalWrapper
                  isOpen={true}
                  onClose={() =>
                    setPublicaciones((prev) =>
                      prev.map((p) =>
                        p.id === pub.id
                          ? { ...p, comentarioVisible: false }
                          : p
                      )
                    )
                  }
                  title="Nuevo comentario"
                  showToolbar={true}
                >
                  <input
                    type="text"
                    placeholder="Escribe tu comentario..."
                    className="w-full border p-2 rounded mb-3"
                    value={pub.nuevoComentario || ""}
                    onChange={(e) => {
                      const nuevoValor = e.target.value;
                      setPublicaciones((prev) =>
                        prev.map((p) =>
                          p.id === pub.id
                            ? { ...p, nuevoComentario: nuevoValor }
                            : p
                        )
                      );
                    }}
                  />

                  <input type="file" accept="image/*" hidden />
                  <input type="file" hidden />
                  <button
                    onClick={() => enviarComentario(pub.id)}
                    className="bg-[#4b1e25] text-white px-4 py-2 rounded hover:bg-[#652837]"
                  >
                    Comentar
                  </button>
                </ModalWrapper>
              )}
            </div>
          </div>
        ))}
      </div>

      <ModalWrapper
        isOpen={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        title="Nueva publicación"
        showToolbar={true}
      >
        <input
          type="text"
          placeholder="Título"
          className="w-full border p-2 rounded mb-2"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="Contenido"
          rows={4}
          className="w-full border p-2 rounded mb-4"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />

        <button
          onClick={publicar}
          className="bg-[#4b1e25] text-white px-4 py-2 rounded hover:bg-[#652837]"
        >
          Publicar
        </button>
      </ModalWrapper>
    </div>
  );
}
