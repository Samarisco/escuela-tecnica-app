import { useEffect, useState } from "react";
import { FaLock, FaChevronDown, FaChevronUp } from "react-icons/fa";

const grados = ["1", "2", "3", "4", "5", "6"];
const letrasMatutino = ["A", "B", "C", "D", "E", "F"];
const letrasVespertino = ["G", "H", "I", "J", "K", "L"];

const GestionarAlumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [formPass, setFormPass] = useState({ open: false, alumno: null, nuevaPass: "" });
  const [turnoActivo, setTurnoActivo] = useState(null);
  const [gradoActivo, setGradoActivo] = useState(null);
  const [seccionesAbiertas, setSeccionesAbiertas] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const obtenerAlumnos = async () => {
      try {
        const res = await fetch("http://localhost:8000/alumnos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener alumnos");
        const data = await res.json();
        setAlumnos(data);
      } catch (err) {
        console.error("Error:", err.message);
        setAlumnos([]);
      }
    };

    obtenerAlumnos();
  }, [token]);

  const toggleSeccion = (clave) => {
    setSeccionesAbiertas((prev) => ({ ...prev, [clave]: !prev[clave] }));
  };

  const handleUpdatePassword = async () => {
    if (!formPass.nuevaPass.trim()) {
      setMensaje("❌ Ingresa una contraseña válida.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/alumnos/${formPass.alumno.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: formPass.nuevaPass }),
      });

      if (!res.ok) throw new Error();
      setMensaje(`✅ Contraseña actualizada para ${formPass.alumno.nombre}`);
      setFormPass({ open: false, alumno: null, nuevaPass: "" });

      setTimeout(() => setMensaje(""), 3000);
    } catch {
      setMensaje("❌ Error al actualizar contraseña");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const normalizar = (str) =>
    str?.toString().trim().toLowerCase().replace(/[\s°\-\_]+/g, "");

  const obtenerAlumnosPorGrupo = (grado, letra, turno) => {
    const nombreGrupo = `${grado}°${letra} - ${turno}`;
    return alumnos.filter((a) => normalizar(a.grupo) === normalizar(nombreGrupo));
  };

  const renderGrupo = (grado, letra, turno) => {
    const nombreGrupo = `${grado}°${letra} - ${turno}`;
    const clave = `${grado}${letra}${turno}`;
    const alumnosGrupo = obtenerAlumnosPorGrupo(grado, letra, turno);

    return (
      <div key={clave} className="border rounded-xl mb-4 overflow-hidden shadow">
        <button
          className="w-full flex justify-between items-center bg-[#4b1e25] text-white px-4 py-2 font-semibold text-left"
          onClick={() => toggleSeccion(clave)}
        >
          <span>{nombreGrupo}</span>
          {seccionesAbiertas[clave] ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {seccionesAbiertas[clave] && (
          <div className="bg-white px-4 py-3 space-y-3">
            {alumnosGrupo.length === 0 ? (
              <p className="text-gray-500">Sin alumnos en este grupo.</p>
            ) : (
              alumnosGrupo.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-2"
                >
                  <div className="text-sm">
                    <p className="font-semibold text-[#4b1e25]">{a.nombre} {a.apellido}</p>
                    <p className="text-gray-600 text-sm">Usuario: <span className="font-mono">{a.usuario}</span></p>
                  </div>
                  <button
                    onClick={() => setFormPass({ open: true, alumno: a, nuevaPass: "" })}
                    className="flex items-center gap-2 px-3 py-1 bg-[#7c4367] hover:bg-yellow-400 hover:text-[#4b1e25] text-white text-sm rounded transition"
                  >
                    <FaLock /> Cambiar contraseña
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#4b1e25]">Gestión de alumnos</h2>
      {mensaje && (
        <p className={`mb-4 font-semibold ${mensaje.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
          {mensaje}
        </p>
      )}

      {/* Turnos */}
      <div className="flex gap-4 mb-6">
        {["Matutino", "Vespertino"].map((turno) => (
          <button
            key={turno}
            className={`px-4 py-2 rounded font-semibold transition ${
              turnoActivo === turno
                ? "bg-[#4b1e25] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setTurnoActivo(turnoActivo === turno ? null : turno)}
          >
            {turno}
          </button>
        ))}
      </div>

      {/* Grados */}
      {turnoActivo && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {grados.map((grado) => (
            <button
              key={grado}
              className={`py-2 rounded text-sm font-medium transition ${
                gradoActivo === grado
                  ? "bg-[#7c4367] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setGradoActivo(gradoActivo === grado ? null : grado)}
            >
              {grado}° Grado
            </button>
          ))}
        </div>
      )}

      {/* Grupos por grado */}
      {turnoActivo && gradoActivo && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#4b1e25]">
            Grupos de {gradoActivo}° - {turnoActivo}
          </h3>
          {(turnoActivo === "Matutino" ? letrasMatutino : letrasVespertino).map((letra) =>
            renderGrupo(gradoActivo, letra, turnoActivo)
          )}
        </div>
      )}

      {/* Modal cambio de contraseña */}
      {formPass.open && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-[#4b1e25]">
              Cambiar contraseña de {formPass.alumno.nombre} {formPass.alumno.apellido}
            </h3>
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#7c4367] outline-none mb-4"
              value={formPass.nuevaPass}
              onChange={(e) => setFormPass({ ...formPass, nuevaPass: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setFormPass({ open: false, alumno: null, nuevaPass: "" })}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdatePassword}
                className="px-4 py-2 rounded bg-[#4b1e25] text-white hover:bg-yellow-400 hover:text-[#4b1e25] text-sm"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarAlumnos;
