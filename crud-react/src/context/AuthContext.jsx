import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedUsuario = localStorage.getItem("usuario");
    if (savedRole) setRole(savedRole);
    if (savedUsuario) setUsuario(savedUsuario);
  }, []);

  const login = (role, usuario) => {
    setRole(role);
    setUsuario(usuario);
    localStorage.setItem("role", role);
    localStorage.setItem("usuario", usuario);
  };

  const logout = () => {
    setRole(null);
    setUsuario(null);
    localStorage.removeItem("role");
    localStorage.removeItem("usuario");
  };

  const isAuthenticated = !!role; // ✅ Se agrega para uso en rutas protegidas

  return (
    <AuthContext.Provider value={{ role, usuario, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
