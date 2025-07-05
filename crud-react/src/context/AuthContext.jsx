import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null); // nuevo

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedUsuario = localStorage.getItem("usuario");
    const savedToken = localStorage.getItem("token");
    if (savedRole) setRole(savedRole);
    if (savedUsuario) setUsuario(savedUsuario);
    if (savedToken) setToken(savedToken);
  }, []);

  const login = (role, usuario, token) => {
    setRole(role);
    setUsuario(usuario);
    setToken(token);
    localStorage.setItem("role", role);
    localStorage.setItem("usuario", usuario);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setRole(null);
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("role");
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!token; // autenticar con token

  return (
    <AuthContext.Provider value={{ role, usuario, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
