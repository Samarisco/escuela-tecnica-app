import { useEffect, useState } from "react";
const token = localStorage.getItem("token");
export default function ProfesorDashboard() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Columna 1: Mensaje de bienvenida */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Bienvenido, Profesor</h1>
        <p className="text-gray-700">
          Desde aquí puedes gestionar tus grupos, asignar tareas y subir material para tus clases.
        </p>
      </div>
    </div>
  );
}
