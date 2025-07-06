import { useState, useEffect } from "react";

const AlumnosAdmin = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [grupo, setGrupo] = useState("");
  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/grupos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener grupos");

        const data = await res.json();
        setGruposDisponibles(data);
      } catch (error) {
        console.error("Error al obtener grupos:", error);
        setGruposDisponibles([]);
      }
    };

    fetchGrupos();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/alumnos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, apellido, grupo }),
      });

      if (res.ok) {
        const data = await res.json();
        setMensaje(`✅ Alumno agregado con usuario: ${data.usuario}`);
        setNombre("");
        setApellido("");
        setGrupo("");
      } else {
        const error = await res.json();
        setMensaje(`❌ ${error.detail || "Error al agregar alumno"}`);
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al conectar con el servidor");
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
            <option key={g.id} value={`${g.grado}°${g.letra} - ${g.turno}`}>
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

      {mensaje && (
        <p
          className={`mt-4 font-semibold ${
            mensaje.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default AlumnosAdmin;
