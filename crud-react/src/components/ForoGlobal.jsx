import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  RiAddLine,
  RiChat1Line,
  RiThumbUpLine,
  RiMore2Fill,
  RiDeleteBin6Line,
  RiEdit2Line,
  RiMessage3Line,
} from "react-icons/ri";
import ModalForo from "./ModalForo";

export default function ForoGlobal() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [mostrarModalComentario, setMostrarModalComentario] = useState(null);
  const contenidoRef = useRef(null);

  const usuario = localStorage.getItem("usuario");
  const rol = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/foro-global", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const autoresDePublicaciones = data.map((p) => p.autor);
        const autoresDeComentarios = data.flatMap((p) =>
          (p.comentarios || []).map((c) => c.autor)
        );
        const autoresUnicos = [...new Set([...autoresDePublicaciones, ...autoresDeComentarios])];

        const infoAutores = {};
        for (const autor of autoresUnicos) {
          try {
            const res = await fetch(`http://localhost:8000/usuario-info/${autor}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
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
          comentarios: (pub.comentarios || []).map((c) => ({
            ...c,
            autorInfo: infoAutores[c.autor],
          })),
        }));

        setPublicaciones(publicacionesConInfo);
        setCargando(false);
      })
      .catch(() => {
        setPublicaciones([]);
        setCargando(false);
      });
  }, [token]);
    const publicar = async () => {
    if (!titulo || !contenido) return;

    let imagen_url = imagen ? null : publicaciones.find((p) => p.id === modoEdicion)?.imagen_url || null;
    let archivo_url = archivo ? null : publicaciones.find((p) => p.id === modoEdicion)?.archivo_url || null;

    if (imagen) {
      const formData = new FormData();
      formData.append("file", imagen);
      const res = await fetch("http://localhost:8000/subir-archivo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      imagen_url = data.url;
    }

    if (archivo) {
      const formData = new FormData();
      formData.append("file", archivo);
      const res = await fetch("http://localhost:8000/subir-archivo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      archivo_url = data.url;
    }

    const payload = {
      titulo,
      contenido,
      autor: usuario,
      imagen_url,
      archivo_url,
    };

    const endpoint = modoEdicion
      ? `http://localhost:8000/foro-global/${modoEdicion}`
      : "http://localhost:8000/foro-global";
    const method = modoEdicion ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const nuevaPub = await res.json();
        const autorInfoRes = await fetch(`http://localhost:8000/usuario-info/${usuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const autorInfo = await autorInfoRes.json();

        if (modoEdicion) {
          setPublicaciones((prev) =>
            prev.map((p) =>
              p.id === modoEdicion
                ? {
                    ...nuevaPub,
                    autorInfo,
                    comentarios: p.comentarios,
                    nuevoComentario: "",
                  }
                : p
            )
          );
        } else {
          setPublicaciones([
            {
              ...nuevaPub,
              autorInfo,
              nuevoComentario: "",
              comentarios: [],
            },
            ...publicaciones,
          ]);
        }

        setMostrarFormulario(false);
        setModoEdicion(null);
        setTitulo("");
        setContenido("");
        setImagen(null);
        setArchivo(null);
      }
    } catch (err) {
      console.error("Error al publicar/editar:", err);
    }
  };

  const toggleMenu = (id) => {
    setMenuAbierto((prev) => (prev === id ? null : id));
  };

  const eliminarPublicacion = async (id) => {
    if (!window.confirm("¿Eliminar publicación?")) return;
    try {
      const res = await fetch(`http://localhost:8000/foro-global/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setPublicaciones((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const enviarComentario = async (id) => {
    const pub = publicaciones.find((p) => p.id === id);
    if (!pub.nuevoComentario) return;

    const payload = {
      publicacion_id: id,
      autor: usuario,
      contenido: pub.nuevoComentario,
    };

    try {
      const res = await fetch("http://localhost:8000/foro-global/comentario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const nuevo = await res.json();
        const autorInfoRes = await fetch(`http://localhost:8000/usuario-info/${usuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const autorInfo = await autorInfoRes.json();

        setPublicaciones((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  comentarios: [...p.comentarios, { ...nuevo, autorInfo }],
                  nuevoComentario: "",
                }
              : p
          )
        );
        setMostrarModalComentario(null);
      }
    } catch (err) {
      console.error("Error comentario:", err);
    }
  };
  return (
    <div className="p-4">
      <div className="relative mb-8">
        {/* Encabezado fijo dentro del componente */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-md rounded-md gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#4b1e25] tracking-tight">
            📢 Foro Global
          </h1>

          {rol === "profesor" && (
            <button
              onClick={() => {
                setTitulo("");
                setContenido("");
                setImagen(null);
                setArchivo(null);
                setModoEdicion(null);
                setMostrarFormulario(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4b1e25] text-white font-medium hover:bg-yellow-400 transition-colors border-b-4 border-yellow-400 shadow text-sm"
            >
              <RiAddLine className="text-lg" />
              Publicar
            </button>
          )}
        </div>

        {/* Espacio para evitar que el contenido se tape con el encabezado */}
        <div className="h-[90px]" />
      </div>

      {cargando ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-gray-200 p-4 rounded">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-4/6"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {publicaciones.map((pub) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-xl border border-[#e5e5e5] shadow-lg p-5 transition hover:shadow-xl border-l-6 border pl-4"
            >
              {/* Opciones de autor */}
              {pub.autor === usuario && (
                <div className="absolute top-4 right-4">
                  <button onClick={() => toggleMenu(pub.id)} className="text-gray-500 hover:text-[#4b1e25]">
                    <RiMore2Fill size={20} />
                  </button>
                  {menuAbierto === pub.id && (
                    <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10 w-32">
                      <button
                        onClick={() => {
                          setTitulo(pub.titulo);
                          setContenido(pub.contenido);
                          setModoEdicion(pub.id);
                          setMostrarFormulario(true);
                          setMenuAbierto(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm"
                      >
                        <RiEdit2Line /> Editar
                      </button>
                      <button
                        onClick={() => eliminarPublicacion(pub.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
                      >
                        <RiDeleteBin6Line /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}

              <h3 className="text-2xl font-extrabold text-[#4b1e25] mb-3 tracking-tight">{pub.titulo}</h3>

             <div className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed whitespace-pre-wrap prose max-w-none" 
             dangerouslySetInnerHTML={{ __html: pub.contenido }} />


              {/* Imagen o archivo */}
              {pub.imagen_url && (
                <div className="mt-3">
                  <img
                    src={`http://localhost:8000/${pub.imagen_url}`}
                    alt="Contenido"
                    className="w-full h-auto max-h-[500px] object-contain rounded"
                  />
                </div>
              )}

              {pub.archivo_url && (
                <a
                  href={`http://localhost:8000/${pub.archivo_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-yellow-600 text-sm font-medium hover:underline mt-2 inline-block"
                >
                  📎 Ver archivo adjunto
                </a>
              )}

              <div className="text-xs text-gray-500 mt-3 italic">
                Publicado por <strong>{pub.autorInfo?.nombre || pub.autor}</strong>
                {pub.autorInfo?.tipo === "profesor" && (
                  <span className="ml-1 text-xs text-gray-600">(Profesor/a de {pub.autorInfo.materia})</span>
                )}
                {pub.autorInfo?.tipo === "alumno" && (
                  <span className="ml-1 text-xs text-gray-600">(Alumno de {pub.autorInfo.grupo})</span>
                )}
                • {new Date(pub.fecha).toLocaleString()}
              </div>

              {/* Reacciones y botones */}
              <div className="mt-4 pt-3 border-t border-dashed border-[#e5e5e5] flex justify-between items-center text-sm text-gray-600 ">
                <div className="flex gap-6">
                  <button className="flex items-center gap-1 hover:text-[#4b1e25] ">
                    <RiThumbUpLine /> Me gusta
                  </button>
                  <button
                    className="flex items-center gap-1 hover:text-[#4b1e25]"
                    onClick={() =>
                      setPublicaciones((prev) =>
                        prev.map((p) =>
                          p.id === pub.id ? { ...p, comentarioModalVisible: true } : p
                        )
                      )
                    }
                  >
                    <RiChat1Line /> Comentar
                  </button>
                </div>
                <button
                  className="text-xs text-[#4b1e25] hover:underline"
                  onClick={() =>
                    setPublicaciones((prev) =>
                      prev.map((p) =>
                        p.id === pub.id
                          ? { ...p, mostrarComentarios: !p.mostrarComentarios }
                          : p
                      )
                    )
                  }
                >
                  {pub.mostrarComentarios ? "Ocultar comentarios" : "Ver comentarios"}
                </button>
              </div>
              {/* Modal para nuevo comentario */}
              {pub.comentarioModalVisible && (
                <ModalForo
                  isOpen={true}
                  onClose={() =>
                    setPublicaciones((prev) =>
                      prev.map((p) =>
                        p.id === pub.id ? { ...p, comentarioModalVisible: false } : p
                      )
                    )
                  }
                  title="Nuevo comentario"
                  showToolbar={false}
                >
                  <input
                    type="text"
                    placeholder="Escribe tu comentario..."
                    className="w-full border border-gray-300 p-2 rounded mb-3"
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
                  <button
                    onClick={() => enviarComentario(pub.id)}
                    className="bg-[#4b1e25] text-white px-4 py-2 rounded hover:bg-[#652837]"
                  >
                    Comentar
                  </button>
                </ModalForo>
              )}

              {/* Comentarios existentes */}
              {pub.mostrarComentarios && (
                <div className="mt-4 space-y-2">
                  {pub.comentarios.map((comentario) => (
                    <div
                      key={comentario.id}
                      className="bg-[#f9f7f6] border border-[#e0d6d3] rounded-xl p-3 text-sm shadow-sm"
                    >
                      <div className="text-[#4b1e25] font-bold text-sm mb-1 tracking-tight">
                        {comentario.autorInfo?.nombre || comentario.autor}
                        {comentario.autorInfo?.tipo === "alumno" &&
                          comentario.autorInfo.grupo && (
                            <span className="ml-1 text-xs text-gray-600">
                              (Grupo {comentario.autorInfo.grupo})
                            </span>
                          )}
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(comentario.fecha).toLocaleString()}
                        </span>
                      </div>
                      <div>{comentario.contenido}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de nueva publicación */}
      <ModalForo
        isOpen={mostrarFormulario}
        onClose={() => {
          setMostrarFormulario(false);
          setModoEdicion(null);
        }}
        title={modoEdicion ? "Editar publicación" : "Nueva publicación"}
        showToolbar={true}
        onImageChange={(file) => setImagen(file)}
        onFileChange={(file) => setArchivo(file)}
        onSubmit={publicar}
      >
        <input
          type="text"
          placeholder="Título"
          className="w-full border border-gray-300 p-3 rounded-md shadow-sm text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4b1e25]"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          placeholder="Escribe algo..."
          className="w-full border border-gray-300 p-3 rounded-md shadow-sm min-h-[120px] text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4b1e25]"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />
        {imagen && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
            <p className="text-sm text-[#4b1e25] font-medium mb-2 flex items-center gap-1">
              📷 Imagen seleccionada:{" "}
              <span className="font-normal text-gray-700">{imagen.name}</span>
            </p>
            <div className="border rounded-md overflow-hidden">
              <img
                src={URL.createObjectURL(imagen)}
                alt="Preview"
                className="w-full h-auto max-h-64 object-cover"
              />
            </div>
          </div>
        )}
        {archivo && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
            <p className="text-sm text-[#4b1e25] font-medium flex items-center gap-1">
              📎 Archivo seleccionado:{" "}
              <span className="font-normal text-gray-700">{archivo.name}</span>
            </p>
          </div>
        )}
      </ModalForo>
    </div>
  );
}
