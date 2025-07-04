// === FRONTEND: Formulario para agregar alumno ===

// src/components/admin/AlumnosAdmin.jsx
import { useState, useEffect } from "react";

const AlumnosAdmin = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [grupo, setGrupo] = useState("");
  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/grupos")
      .then((res) => res.json())
      .then((data) => setGruposDisponibles(data))
      .catch(() => setGruposDisponibles([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/alumnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, grupo }),
      });

      if (res.ok) {
        const data = await res.json();
        setMensaje(`Alumno agregado con usuario: ${data.usuario}`);
        setNombre("");
        setApellido("");
        setGrupo("");
      } else {
        const error = await res.json();
        setMensaje(error.detail || "Error al agregar alumno");
      }
    } catch (err) {
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Agregar Alumno</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <select
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>
            Selecciona un grupo
          </option>
          {gruposDisponibles.map((g) => (
            <option
              key={g.id}
              value={`${g.grado}°${g.letra} - ${g.turno}`}
            >
              {`${g.grado}°${g.letra} - ${g.turno}`}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Alumno
        </button>
      </form>
      {mensaje && <p className="mt-4 text-green-600 font-semibold">{mensaje}</p>}
    </div>
  );
};

export default AlumnosAdmin;
