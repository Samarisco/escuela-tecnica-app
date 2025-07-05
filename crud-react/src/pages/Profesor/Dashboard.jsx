import { useEffect, useState } from "react";
import {
  RiTeamLine,
  RiBook3Line,
  RiFileList3Line,
  RiTimeLine,
} from "react-icons/ri";

const token = localStorage.getItem("token");
const usuario = localStorage.getItem("usuario");

export default function ProfesorDashboard() {
  const [grupos, setGrupos] = useState([]);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const res = await fetch(`http://localhost:8000/profesores/${usuario}/grupos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener grupos");

        const data = await res.json();
        setGrupos(data);

        const total = data.reduce((sum, grupo) => sum + (grupo.total_alumnos || 0), 0);
        setTotalAlumnos(total);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (usuario && token) fetchGrupos();
  }, []);

  return (
    <div className="text-[#4b1e25]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Panel general del profesor</h2>
        <p className="text-gray-700 mt-1">
          Este es un resumen de tu actividad en la plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border-t-4 border-yellow-400 shadow rounded-xl p-5 flex items-center gap-4">
          <RiBook3Line size={32} className="text-[#7c4367]" />
          <div>
            <h3 className="text-lg font-semibold">Grupos asignados</h3>
            <p className="text-2xl font-bold">{grupos.length}</p>
          </div>
        </div>

        <div className="bg-white border-t-4 border-yellow-400 shadow rounded-xl p-5 flex items-center gap-4">
          <RiTeamLine size={32} className="text-[#7c4367]" />
          <div>
            <h3 className="text-lg font-semibold">Total de alumnos</h3>
            <p className="text-2xl font-bold">{totalAlumnos}</p>
          </div>
        </div>
      </div>

      {/* Detalles de grupos asignados */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <RiFileList3Line /> Mis grupos
        </h2>

        {loading ? (
          <p className="text-gray-500">Cargando información...</p>
        ) : grupos.length === 0 ? (
          <p className="text-gray-500">No tienes grupos asignados aún.</p>
        ) : (
          <ul className="space-y-3 text-gray-800 text-sm">
            {grupos.map((grupo, index) => (
              <li key={index} className="flex items-center gap-2">
                <RiTimeLine className="text-[#7c4367]" />
                {grupo.grado}°{grupo.letra} - Turno {grupo.turno}{" "}
                {grupo.total_alumnos && (
                  <span className="ml-auto text-gray-500 text-xs">
                    {grupo.total_alumnos} alumnos
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
