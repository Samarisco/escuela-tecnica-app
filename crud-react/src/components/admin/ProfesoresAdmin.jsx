import { useState, useEffect } from "react";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";

export default function ProfesoresAdmin({ isModal = false }) {
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoProfesor, setNuevoProfesor] = useState({
    nombre: "",
    apellido: "",
    fechaEntrada: "",
    materia: "",
  });
  const [credencialesGeneradas, setCredencialesGeneradas] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/materias")
      .then((res) => res.json())
      .then((data) => setMaterias(data))
      .catch((err) => console.error("Error cargando materias:", err));
  }, []);

  const handleInputChange = (e) => {
    setNuevoProfesor({ ...nuevoProfesor, [e.target.name]: e.target.value });
  };

  const generarUsuario = (nombre, apellido) => {
    let base = (apellido + nombre[0]).toLowerCase();
    let usuario = base;
    let intentos = 1;
    while (profesores.find((p) => p.usuario === usuario)) {
      usuario = base + nombre.slice(0, intentos + 1).toLowerCase();
      intentos++;
    }
    return usuario;
  };

  const agregarProfesor = async () => {
    const { nombre, apellido, fechaEntrada, materia } = nuevoProfesor;
    if (!nombre || !apellido || !fechaEntrada || !materia)
      return alert("Completa todos los campos");

    const usuario = generarUsuario(nombre, apellido);
    const contraseña = "12345678";

    const profesorParaGuardar = {
      nombre,
      apellido,
      fechaEntrada,
      materia,
      usuario,
      password: contraseña,
      role: "profesor",
    };

    try {
      const response = await fetch("http://localhost:8000/profesores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Token JWT incluido
        },
        body: JSON.stringify(profesorParaGuardar),
      });

      if (!response.ok) throw new Error("Error al guardar");

      const data = await response.json();
      setProfesores([...profesores, data]);
      setNuevoProfesor({ nombre: "", apellido: "", fechaEntrada: "", materia: "" });
      setCredencialesGeneradas({ usuario, contraseña });
      if (!isModal) setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al guardar profesor:", error);
    }
  };

  const eliminarProfesor = (usuario) => {
    if (window.confirm(`¿Eliminar al usuario ${usuario}?`)) {
      setProfesores(profesores.filter((p) => p.usuario !== usuario));
    }
  };

  return (
    <div>
      {!isModal && (
        <h2 className="text-2xl font-bold mb-6">Gestión de Profesores</h2>
      )}

      {!isModal && (
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-[#4b1e25] text-white px-4 py-2 rounded hover:bg-[#652837] mb-6 flex items-center gap-2"
        >
          <RiAddLine /> {mostrarFormulario ? "Cancelar" : "Agregar profesor"}
        </button>
      )}

      {(mostrarFormulario || isModal) && (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="nombre"
            value={nuevoProfesor.nombre}
            onChange={handleInputChange}
            placeholder="Nombre(s)"
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            name="apellido"
            value={nuevoProfesor.apellido}
            onChange={handleInputChange}
            placeholder="Apellido"
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="date"
            name="fechaEntrada"
            value={nuevoProfesor.fechaEntrada}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded"
          />

          <select
            name="materia"
            value={nuevoProfesor.materia}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">-- Selecciona una materia --</option>
            {materias.map((m, i) => (
              <option key={i} value={m.nombre}>
                {m.nombre}
              </option>
            ))}
          </select>

          <button
            onClick={agregarProfesor}
            className="col-span-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Guardar profesor
          </button>
        </div>
      )}

      {credencialesGeneradas && (
        <div className="bg-green-100 text-green-800 border border-green-300 rounded p-4 mb-6">
          <p>
            <strong>Usuario generado:</strong> {credencialesGeneradas.usuario}
          </p>
          <p>
            <strong>Contraseña por defecto:</strong> {credencialesGeneradas.contraseña}
          </p>
        </div>
      )}

      {!isModal && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {profesores.map((profesor, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded shadow p-4 flex flex-col gap-2"
            >
              <h3 className="text-lg font-semibold text-[#4b1e25]">
                {profesor.nombre} {profesor.apellido}
              </h3>
              <p>📅 Ingreso: {profesor.fechaEntrada}</p>
              <p>📘 Materia: {profesor.materia}</p>
              <p>👤 Usuario: {profesor.usuario}</p>
              <button
                onClick={() => eliminarProfesor(profesor.usuario)}
                className="mt-2 text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <RiDeleteBinLine /> Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
