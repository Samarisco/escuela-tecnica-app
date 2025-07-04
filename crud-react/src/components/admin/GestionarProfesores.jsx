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

  useEffect(() => {
    fetch("http://localhost:8000/profesores")
      .then((res) => res.json())
      .then(setProfesores)
      .catch(console.error);

    fetch("http://localhost:8000/materias")
      .then((res) => res.json())
      .then(setMaterias)
      .catch(console.error);

    fetch("http://localhost:8000/grupos")
      .then((res) => res.json())
      .then(setGrupos)
      .catch(console.error);
  }, []);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profesorSeleccionado),
      });
      if (!res.ok) throw new Error("Error al guardar");

      alert("Cambios guardados correctamente");
      cerrarModal();
      const nuevos = profesores.map((p) =>
        p.id === profesorSeleccionado.id ? profesorSeleccionado : p
      );
      setProfesores(nuevos);
    } catch (err) {
      alert("Error al guardar los cambios");
      console.error(err);
    }
  };

  const guardarPassword = async () => {
    try {
      const res = await fetch(`http://localhost:8000/profesores/${profesorSeleccionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      <h2 className="text-2xl font-bold mb-6">Gestión de Profesores</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profesores.map((p) => (
          <div key={p.id} className="bg-white shadow rounded border p-4">
            <p className="font-bold text-[#4b1e25]">
              {p.nombre} {p.apellido}
            </p>
            <p className="text-sm">Usuario: {p.usuario}</p>
            <p className="text-sm">Materia: {p.materia}</p>
            <p className="text-sm">
              Grupos: {p.grupos && p.grupos.length > 0 ? p.grupos.join(", ") : "No asignado"}
            </p>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => abrirModal(p)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <RiEdit2Line /> Editar
              </button>
              <button
                onClick={() => abrirCambioPassword(p)}
                className="text-orange-600 hover:text-orange-800 flex items-center gap-1"
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
              <label className="text-sm font-medium">Materia asignada</label>
              <select
                value={profesorSeleccionado.materia}
                onChange={(e) =>
                  setProfesorSeleccionado({
                    ...profesorSeleccionado,
                    materia: e.target.value,
                  })
                }
                className="border p-2 rounded w-full"
              >
                {materias.map((m, i) => (
                  <option key={i} value={m.nombre}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Grupos asignados</label>
              <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-1">
                {grupos.map((g, i) => {
                  const valor = `${g.grado}${g.letra} - ${g.turno}`;
                  const estaSeleccionado = (profesorSeleccionado.grupos || []).includes(valor);

                  return (
                    <label key={i} className="flex items-center gap-2">
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
              className="bg-[#4b1e25] text-white px-4 py-2 rounded hover:bg-[#652837] mt-4"
            >
              Guardar cambios
            </button>
          </div>
        )}
      </ModalWrapper>

      {/* Modal para contraseña */}
      <ModalWrapper
        isOpen={modalPassword}
        onClose={cerrarPasswordModal}
        title={`Cambiar contraseña: ${profesorSeleccionado?.nombre}`}
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium">Nueva contraseña</label>
          <input
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="********"
          />

          <button
            onClick={guardarPassword}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Actualizar contraseña
          </button>
        </div>
      </ModalWrapper>
    </div>
  );
}
