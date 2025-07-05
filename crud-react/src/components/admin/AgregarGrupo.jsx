import { useState, useEffect } from "react";
import { RiAddLine } from "react-icons/ri";

export default function AgregarGrupo({ isModal = false }) {
  const [grupos, setGrupos] = useState([]);
  const [nuevoGrupo, setNuevoGrupo] = useState({
    grado: "1",
    turno: "Matutino",
    letra: "A",
  });

  const letrasMatutino = ["A", "B", "C", "D", "E", "F"];
  const letrasVespertino = ["G", "H", "I", "J", "K", "L"];
  const turnos = ["Matutino", "Vespertino"];

  // ✅ Obtener token guardado
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Opcional: precargar los grupos existentes desde el backend si quieres
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedGrupo = { ...nuevoGrupo, [name]: value };

    if (name === "turno") {
      updatedGrupo.letra =
        value === "Matutino" ? letrasMatutino[0] : letrasVespertino[0];
    }

    setNuevoGrupo(updatedGrupo);
  };

  const agregarGrupo = async () => {
    const letrasDisponibles =
      nuevoGrupo.turno === "Matutino" ? letrasMatutino : letrasVespertino;

    if (!letrasDisponibles.includes(nuevoGrupo.letra)) {
      return alert("La letra seleccionada no corresponde al turno elegido.");
    }

    const id = `${nuevoGrupo.grado}${nuevoGrupo.letra}-${nuevoGrupo.turno}`;
    const duplicado = grupos.find((g) => g.id === id);
    if (duplicado) return alert("Ese grupo ya existe.");

    try {
      const response = await fetch("http://localhost:8000/grupos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ JWT obligatorio
        },
        body: JSON.stringify(nuevoGrupo),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Error al guardar grupo");
      }

      const data = await response.json();
      setGrupos([...grupos, { ...data, id }]);
      setNuevoGrupo({ grado: "1", turno: "Matutino", letra: "A" });
    } catch (error) {
      console.error("Error al guardar grupo:", error.message);
      alert(error.message || "Ocurrió un error inesperado");
    }
  };

  const letrasDisponibles =
    nuevoGrupo.turno === "Matutino" ? letrasMatutino : letrasVespertino;

  return (
    <div>
      {!isModal && (
        <h2 className="text-2xl font-bold mb-6">Agregar nuevo grupo</h2>
      )}

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {/* Grado */}
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Grado
          </label>
          <select
            name="grado"
            value={nuevoGrupo.grado}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          >
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Turno */}
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Turno
          </label>
          <select
            name="turno"
            value={nuevoGrupo.turno}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          >
            {turnos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Letra */}
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Letra
          </label>
          <select
            name="letra"
            value={nuevoGrupo.letra}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          >
            {letrasDisponibles.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Botón agregar */}
        <button
          onClick={agregarGrupo}
          className="col-span-full bg-[#4b1e25] text-white py-2 rounded hover:bg-[#652837] transition flex items-center justify-center gap-2"
        >
          <RiAddLine /> Agregar grupo
        </button>
      </div>

      {/* Vista previa si no es modal */}
      {!isModal && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {grupos.map((grupo, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded shadow p-4 text-center"
            >
              <p className="text-lg font-medium text-[#4b1e25]">
                {grupo.grado}
                {grupo.letra} - {grupo.turno}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
