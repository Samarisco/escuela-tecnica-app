import DashboardLayout from "../../components/DashboardLayout";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [profesores, setProfesores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/profesores")
      .then((res) => res.json())
      .then(setProfesores)
      .catch(() => setProfesores([]));

    fetch("http://localhost:8000/grupos")
      .then((res) => res.json())
      .then(setGrupos)
      .catch(() => setGrupos([]));

    fetch("http://localhost:8000/alumnos")
      .then((res) => res.json())
      .then(setAlumnos)
      .catch(() => setAlumnos([]));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Bienvenido al panel de administrador</h1>
      <p className="mb-6">Aquí puedes gestionar usuarios, ver estadísticas y configurar el sistema.</p>

      {/* Profesores */}
<section className="mb-8">
  <h2 className="text-2xl font-semibold mb-2">Profesores registrados</h2>
  {profesores.length === 0 ? (
    <p className="text-gray-500">No hay profesores registrados.</p>
  ) : (
    <ul className="space-y-1 list-disc list-inside">
      {profesores.map((p) => (
        <li key={p.id}>
          {p.nombre} {p.apellido} - Materia: {p.materia} - Usuario: {p.usuario}
        </li>
      ))}
    </ul>
  )}
</section>

{/* Grupos */}
<section className="mb-8">
  <h2 className="text-2xl font-semibold mb-2">Grupos registrados</h2>
  {grupos.length === 0 ? (
    <p className="text-gray-500">No hay grupos registrados.</p>
  ) : (
    <ul className="space-y-1 list-disc list-inside">
      {grupos.map((g) => (
        <li key={g.id}>
          {g.grado}°{g.letra} - Turno: {g.turno}
        </li>
      ))}
    </ul>
  )}
</section>

{/* Alumnos */}
<section>
  <h2 className="text-2xl font-semibold mb-2">Alumnos registrados</h2>
  {alumnos.length === 0 ? (
    <p className="text-gray-500">No hay alumnos registrados.</p>
  ) : (
    <ul className="space-y-1 list-disc list-inside">
      {alumnos.map((a) => (
        <li key={a.id}>
          {a.nombre} {a.apellido} - Usuario: {a.usuario} - Grupo: {a.grupo}
        </li>
      ))}
    </ul>
  )}
</section>

    </DashboardLayout>
  );
}
