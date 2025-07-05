import { useEffect, useState } from "react";
import { RiEdit2Line, RiLockPasswordLine } from "react-icons/ri";
import ModalWrapper from "../ModalWrapper";

export default function GestionarProfesores() {
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profesoresRes, materiasRes, gruposRes] = await Promise.all([
          fetch("http://localhost:8000/profesores", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/materias", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/grupos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const profesoresData = await profesoresRes.json();
        const materiasData = await materiasRes.json();
        const gruposData = await gruposRes.json();

        setProfesores(profesoresData);
        setMaterias(materiasData);
        setGrupos(gruposData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [token]);

  const abrirModal = (profesor) => {
    setProfesorSeleccionado({ ...profesor });
    setModalAbierto(true);
  };

  const abrirCambioPassword = (profesor) => {
    setProfesorSeleccionado(profesor);
    setNuevaPassword("");
    setModalPassword(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProfesorSeleccionado(null);
  };

  const cerrarPasswordModal = () => {
    setModalPassword(false);
    setNuevaPassword("");
  };

  const guardarCambios = async () => {
    try {
      const res = await fetch(`http://localhost:8000/profesores/${profesorSeleccionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profesorSeleccionado),
      });

      if (!res.ok) throw new Error("Error al guardar");

      alert("Cambios guardados correctamente");
      cerrarModal();

      setProfesores((prev) =>
        prev.map((p) => (p.id === profesorSeleccionado.id ? profesorSeleccionado : p))
      );
    } catch (err) {
      alert("Error al guardar los cambios");
      console.error(err);
    }
  };

  const guardarPassword = async () => {
    try {
      const res = await fetch(`http://localhost:8000/profesores/${profesorSeleccionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: nuevaPassword }),
      });

      if (!res.ok) throw new Error("Error al cambiar la contraseña");

      alert("Contraseña actualizada correctamente");
      cerrarPasswordModal();
    } catch (err) {
      alert("Error al actualizar la contraseña");
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#4b1e25]">Gestión de Profesores</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profesores.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow border-l-4 border-yellow-400 p-4">
            <p className="text-lg font-bold text-[#4b1e25]">
              {p.nombre} {p.apellido}
            </p>
            <p className="text-sm text-gray-700">Usuario: {p.usuario}</p>
            <p className="text-sm text-gray-700">Materia: {p.materia}</p>
            <p className="text-sm text-gray-700">
              Grupos: {p.grupos?.length ? p.grupos.join(", ") : "No asignado"}
            </p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => abrirModal(p)}
                className="text-[#7c4367] hover:text-yellow-400 flex items-center gap-1 transition"
              >
                <RiEdit2Line /> Editar
              </button>
              <button
                onClick={() => abrirCambioPassword(p)}
                className="text-[#4b1e25] hover:text-yellow-400 flex items-center gap-1 transition"
              >
                <RiLockPasswordLine /> Contraseña
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      <ModalWrapper
        isOpen={modalAbierto}
        onClose={cerrarModal}
        title={`Editar: ${profesorSeleccionado?.nombre} ${profesorSeleccionado?.apellido}`}
      >
        {profesorSeleccionado && (
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-[#4b1e25] mb-1 block">
                Materia asignada
              </label>
              <select
                value={profesorSeleccionado.materia}
                onChange={(e) =>
                  setProfesorSeleccionado({
                    ...profesorSeleccionado,
                    materia: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-[#7c4367] outline-none"
              >
                {materias.map((m, i) => (
                  <option key={i} value={m.nombre}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#4b1e25] mb-1 block">
                Grupos asignados
              </label>
              <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-1">
                {grupos.map((g, i) => {
                  const valor = `${g.grado}${g.letra} - ${g.turno}`;
                  const estaSeleccionado = profesorSeleccionado.grupos?.includes(valor);

                  return (
                    <label key={i} className="flex items-center gap-2 text-sm text-gray-800">
                      <input
                        type="checkbox"
                        checked={estaSeleccionado}
                        onChange={() => {
                          const nuevos = estaSeleccionado
                            ? profesorSeleccionado.grupos.filter((grp) => grp !== valor)
                            : [...(profesorSeleccionado.grupos || []), valor];

                          setProfesorSeleccionado({
                            ...profesorSeleccionado,
                            grupos: nuevos,
                          });
                        }}
                      />
                      {valor}
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              onClick={guardarCambios}
              className="bg-[#4b1e25] text-white px-4 py-2 rounded hover:bg-[#652837] mt-4 transition"
            >
              Guardar cambios
            </button>
          </div>
        )}
      </ModalWrapper>

      {/* Modal de contraseña */}
      <ModalWrapper
        isOpen={modalPassword}
        onClose={cerrarPasswordModal}
        title={`Cambiar contraseña: ${profesorSeleccionado?.nombre}`}
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#4b1e25]">
            Nueva contraseña
          </label>
          <input
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-[#7c4367] outline-none"
            placeholder="********"
          />
          <button
            onClick={guardarPassword}
            className="bg-[#4b1e25] text-white px-4 py-2 rounded hover:bg-yellow-400 hover:text-[#4b1e25] transition"
          >
            Actualizar contraseña
          </button>
        </div>
      </ModalWrapper>
    </div>
  );
}
