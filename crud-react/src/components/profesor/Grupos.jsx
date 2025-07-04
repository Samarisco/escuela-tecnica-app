import { useState, useEffect } from "react";
import { RiGroupLine } from "react-icons/ri";

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alumnosPorGrupo, setAlumnosPorGrupo] = useState({});
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
      setError("No se encontró el usuario del profesor.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/profesores/${usuario}/grupos`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los grupos");
        return res.json();
      })
      .then((data) => {
        setGrupos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los grupos.");
        setLoading(false);
      });
  }, []);

  const normalizar = (str) =>
    str?.toString().trim().toLowerCase().replace(/[\s°\-]+/g, "");

  const toggleDetallesGrupo = async (grupo) => {
    if (grupoSeleccionado === grupo) {
      setGrupoSeleccionado(null);
      return;
    }

    setGrupoSeleccionado(grupo);

    if (!alumnosPorGrupo[grupo]) {
      try {
        const res = await fetch("http://localhost:8000/alumnos");
        const data = await res.json();

        const grupoNormalizado = normalizar(grupo);
        const alumnosDelGrupo = data.filter(
          (a) => normalizar(a.grupo) === grupoNormalizado
        );

        setAlumnosPorGrupo((prev) => ({ ...prev, [grupo]: alumnosDelGrupo }));
      } catch (err) {
        console.error("Error al obtener alumnos:", err);
        setAlumnosPorGrupo((prev) => ({ ...prev, [grupo]: [] }));
      }
    }
  };

  if (loading) return <p>Cargando grupos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Grupos asignados</h2>

      {grupos.length === 0 ? (
        <p className="text-gray-600">No tienes grupos asignados.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {grupos.map((grupo, i) => (
            <div
              key={i}
              className="bg-white shadow-md border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition"
            >
              <RiGroupLine className="text-4xl mx-auto text-[#4b1e25]" />
              <h3 className="text-xl font-semibold text-[#4b1e25] mt-2">
                {grupo}
              </h3>
              <button
                onClick={() => toggleDetallesGrupo(grupo)}
                className="mt-3 px-4 py-2 bg-[#4b1e25] text-white rounded hover:bg-[#652837]"
              >
                {grupoSeleccionado === grupo
                  ? "Ocultar detalles"
                  : "Ver alumnos"}
              </button>

              {grupoSeleccionado === grupo && (
                <div className="mt-4 text-left">
                  <h4 className="text-lg font-semibold mb-2">Alumnos:</h4>
                  {alumnosPorGrupo[grupo]?.length > 0 ? (
                    <ul className="text-sm space-y-1">
                      {alumnosPorGrupo[grupo].map((a) => (
                        <li key={a.id} className="border-b py-1">
                          {a.nombre} {a.apellido} •{" "}
                          <span className="font-mono text-gray-600">
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
          ))}
        </div>
      )}
    </div>
  );
}
