import { useEffect, useState } from "react";
import {
  RiUser3Line,
  RiBook2Line,
  RiFolder3Line,
  RiAwardLine,
  RiFileList3Line,
  RiTimeLine,
} from "react-icons/ri";

export default function AlumnoDashboard() {
  const [nombreAlumno, setNombreAlumno] = useState("");
  const grupo = localStorage.getItem("grupo");
  const usuario = localStorage.getItem("usuario");
  const token = localStorage.getItem("token");

  const [tareas, setTareas] = useState(3); // Valor de ejemplo
  const [materiales, setMateriales] = useState(4); // Valor de ejemplo

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch(`http://localhost:8000/usuario-info/${usuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNombreAlumno(data.nombre || usuario);
      } catch (err) {
        console.error("Error al obtener info:", err);
        setNombreAlumno(usuario);
      }
    };

    if (usuario && token) {
      obtenerDatos();
    }
  }, [usuario, token]);

  return (
    <div className="text-[#4b1e25]">
     {/* <div className="mb-6">
        <h1 className="text-2xl font-bold">¡Hola, {nombreAlumno}! 👋</h1>
        <p className="text-gray-600 text-sm mt-1">
          Alumno del grupo <strong>{grupo || "No definido"}</strong>
        </p>
      </div>*/}

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border-t-4 border-yellow-400 shadow rounded-xl p-5 flex items-center gap-4">
          <RiBook2Line size={32} className="text-[#7c4367]" />
          <div>
            <h3 className="text-lg font-semibold">Mis tareas</h3>
            <p className="text-2xl font-bold">{tareas}</p>
          </div>
        </div>

        <div className="bg-white border-t-4 border-yellow-400 shadow rounded-xl p-5 flex items-center gap-4">
          <RiFolder3Line size={32} className="text-[#7c4367]" />
          <div>
            <h3 className="text-lg font-semibold">Material disponible</h3>
            <p className="text-2xl font-bold">{materiales}</p>
          </div>
        </div>

        <div className="bg-white border-t-4 border-yellow-400 shadow rounded-xl p-5 flex items-center gap-4">
          <RiAwardLine size={32} className="text-[#7c4367]" />
          <div>
            <h3 className="text-lg font-semibold">Calificaciones</h3>
            <p className="text-2xl font-bold">--</p>
          </div>
        </div>
      </div>

      {/* Actividad reciente (simulada) */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <RiFileList3Line />
          Actividad reciente
        </h2>

        <ul className="space-y-4 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <RiTimeLine className="text-[#7c4367]" />
            Subiste tu tarea de <strong>Matemáticas</strong>.
          </li>
          <li className="flex items-start gap-2">
            <RiTimeLine className="text-[#7c4367]" />
            Consultaste el material de <strong>Física</strong>.
          </li>
          <li className="flex items-start gap-2">
            <RiTimeLine className="text-[#7c4367]" />
            Participaste en el foro del grupo <strong>{grupo}</strong>.
          </li>
        </ul>
      </div>
    </div>
  );
}
