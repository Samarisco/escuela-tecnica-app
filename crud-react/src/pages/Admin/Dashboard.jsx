import React, { useEffect, useState } from "react";
import {
  RiUser3Line,
  RiTeamLine,
  RiBook2Line,
  RiFileList3Line,
  RiTimeLine,
} from "react-icons/ri";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  const [profesores, setProfesores] = useState(0);
  const [alumnos, setAlumnos] = useState(0);
  const [materias, setMaterias] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resProf, resAlu, resMat] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/profesores`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/alumnos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/materias`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const dataProf = await resProf.json();
        const dataAlu = await resAlu.json();
        const dataMat = await resMat.json();

        setProfesores(dataProf.length || 0);
        setAlumnos(dataAlu.length || 0);
        setMaterias(dataMat.length || 0);
      } catch (err) {
        console.error("Error cargando datos del dashboard", err);
      }
    };

    if (token) cargarDatos();
  }, [token]);

  return (
    <div className="text-[#4b1e25]">
      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border-t-4 border-yellow-400 shadow rounded-xl p-5 flex items-center gap-4">
          <RiUser3Line size={32} className="text-[#7c4367]" />
          <div>
            <h3 className="text-lg font-semibold">Profesores registrados</h3>
            <p className="text-2xl font-bold">{profesores}</p>
          </div>
        </div>

        <div className="bg-white border-t-4 border-yellow-400 shadow rounded-xl p-5 flex items-center gap-4">
          <RiTeamLine size={32} className="text-[#7c4367]" />
          <div>
            <h3 className="text-lg font-semibold">Alumnos inscritos</h3>
            <p className="text-2xl font-bold">{alumnos}</p>
          </div>
        </div>

        <div className="bg-white border-t-4 border-yellow-400 shadow rounded-xl p-5 flex items-center gap-4">
          <RiBook2Line size={32} className="text-[#7c4367]" />
          <div>
            <h3 className="text-lg font-semibold">Materias activas</h3>
            <p className="text-2xl font-bold">{materias}</p>
          </div>
        </div>
      </div>

      {/* Actividad reciente (simulada por ahora) */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <RiFileList3Line />
          Actividad reciente
        </h2>

        <ul className="space-y-4 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <RiTimeLine className="text-[#7c4367]" />
            Se agregó al profesor <strong>María Torres</strong> al grupo 2A.
          </li>
          <li className="flex items-start gap-2">
            <RiTimeLine className="text-[#7c4367]" />
            Se inscribió al alumno <strong>José Pérez</strong> en la materia Matemáticas.
          </li>
          <li className="flex items-start gap-2">
            <RiTimeLine className="text-[#7c4367]" />
            Se creó el grupo <strong>3B Vespertino</strong>.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
