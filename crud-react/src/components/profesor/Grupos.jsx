import { useState, useEffect } from "react";
import { RiGroupLine, RiUser3Line } from "react-icons/ri";

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alumnosPorGrupo, setAlumnosPorGrupo] = useState({});
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!usuario) {
      setError("No se encontró el usuario del profesor.");
      setLoading(false);
      return;
    }

    const fetchGrupos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/profesores/${usuario}/grupos`, { headers });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Error al obtener los grupos");
        }

        const data = await res.json();
        setGrupos(data);
      } catch (err) {
        console.error("Error:", err.message);
        setError("Error al cargar los grupos.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrupos();
  }, [usuario]);

  const normalizar = (str) =>
    str?.toString().trim().toLowerCase().replace(/[\s°\-]+/g, "");

  const obtenerClaveGrupo = (grupo) =>
    `${grupo.grado}${grupo.letra}-${grupo.turno}`.toLowerCase().replace(/\s/g, "");

  const toggleDetallesGrupo = async (grupo) => {
    const claveGrupo = obtenerClaveGrupo(grupo);

    if (grupoSeleccionado === claveGrupo) {
      setGrupoSeleccionado(null);
      return;
    }

    setGrupoSeleccionado(claveGrupo);

    if (!alumnosPorGrupo[claveGrupo]) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/alumnos`, { headers });

        if (!res.ok) throw new Error("Error al obtener alumnos");

        const data = await res.json();
        const alumnosDelGrupo = data.filter(
          (a) => normalizar(a.grupo) === normalizar(`${grupo.grado}${grupo.letra}${grupo.turno}`)
        );

        setAlumnosPorGrupo((prev) => ({ ...prev, [claveGrupo]: alumnosDelGrupo }));
      } catch (err) {
        console.error("Error al obtener alumnos:", err.message);
        setAlumnosPorGrupo((prev) => ({ ...prev, [claveGrupo]: [] }));
      }
    }
  };

  if (loading) return <p className="text-gray-600">Cargando grupos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#4b1e25] mb-6">Grupos asignados</h2>

      {grupos.length === 0 ? (
        <p className="text-gray-600">No tienes grupos asignados.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {grupos.map((grupo) => {
            const clave = obtenerClaveGrupo(grupo);
            return (
              <div
                key={grupo.id}
                className="bg-white shadow-md border-t-4 border-yellow-400 rounded-xl p-5 hover:shadow-lg transition"
              >
                <div className="flex flex-col items-center text-center">
                  <RiGroupLine className="text-4xl text-[#7c4367]" />
                  <h3 className="text-xl font-semibold text-[#4b1e25] mt-2">
                    {grupo.grado}°{grupo.letra} - Turno {grupo.turno}
                  </h3>

                  <button
                    onClick={() => toggleDetallesGrupo(grupo)}
                    className="mt-4 px-4 py-2 bg-[#4b1e25] text-white rounded hover:bg-[#652837] transition"
                  >
                    {grupoSeleccionado === clave ? "Ocultar detalles" : "Ver alumnos"}
                  </button>
                </div>

                {grupoSeleccionado === clave && (
                  <div className="mt-4 text-left">
                    <h4 className="text-lg font-semibold text-[#4b1e25] mb-2">
                      Alumnos del grupo
                    </h4>
                    {alumnosPorGrupo[clave]?.length > 0 ? (
                      <ul className="text-sm space-y-1 max-h-48 overflow-y-auto pr-1">
                        {alumnosPorGrupo[clave].map((a) => (
                          <li
                            key={a.id}
                            className="flex items-center justify-between border-b py-1"
                          >
                            <span className="flex items-center gap-2">
                              <RiUser3Line className="text-[#7c4367]" />
                              {a.nombre} {a.apellido}
                            </span>
                            <span className="font-mono text-xs text-gray-600">
                              {a.usuario}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No hay alumnos registrados en este grupo.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
