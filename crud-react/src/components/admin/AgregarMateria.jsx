import { useEffect, useState } from "react";
import { RiAddLine } from "react-icons/ri";

export default function AgregarMateria({ isModal = false }) {
  const [materias, setMaterias] = useState([]);
  const [nuevaMateria, setNuevaMateria] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // --- Cargar materias al iniciar ---
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch("http://localhost:8000/materias", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Error al obtener materias");

        const data = await response.json();
        setMaterias(data.map((m) => m.nombre));
      } catch (err) {
        console.error("❌ Error al cargar materias:", err);
      }
    };

    fetchMaterias();
  }, [token]);

  // --- Agregar nueva materia ---
  const agregarMateria = async () => {
    console.log("🚀 Se presionó el botón Agregar");
    const nombre = nuevaMateria.trim();
    setError("");

    if (!nombre) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    if (materias.includes(nombre)) {
      setError("La materia ya existe.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/materias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // ✅ encabezado de autenticación
        },
        body: JSON.stringify({ nombre }),
      });

      console.log("✅ Respuesta del servidor:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error del servidor:", errorText);
        throw new Error("Error al guardar la materia");
      }

      const data = await response.json();
      console.log("🎉 Materia guardada:", data);

      setMaterias([...materias, data.nombre]);
      setNuevaMateria("");
    } catch (error) {
      console.error("🚫 Error al guardar materia:", error);
      setError("Hubo un error al guardar.");
    }
  };

  return (
    <div>
      {!isModal && (
        <h2 className="text-2xl font-bold mb-6">Agregar nueva materia</h2>
      )}

      <div className="mb-6 flex gap-2 items-end">
        <div className="w-full">
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Nombre de la materia
          </label>
          <input
            type="text"
            value={nuevaMateria}
            onChange={(e) => setNuevaMateria(e.target.value)}
            placeholder="Ej. Química"
            className="border border-gray-300 p-2 rounded w-full"
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
        <button
          onClick={agregarMateria}
          className="bg-[#4b1e25] text-white px-4 py-2 rounded hover:bg-[#652837] h-fit flex items-center gap-2"
        >
          <RiAddLine /> Agregar
        </button>
      </div>

      {!isModal && materias.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materias.map((materia, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded shadow p-4 text-center"
            >
              <p className="text-lg font-medium text-[#4b1e25]">{materia}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
