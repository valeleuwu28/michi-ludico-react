// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("michi_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const res = await fetch("http://localhost/michi_api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      setUser(data.user);
      localStorage.setItem("michi_user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    }

    return { success: false, message: data.error };
  };

  const logout = async () => {
    try {
      // 1. Llamar al backend para cerrar sesión
      await fetch("http://localhost/michi_api/logout.php", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error en logout backend:", error);
    } finally {
      // 2. Limpiar siempre del lado del cliente
      setUser(null);
      localStorage.removeItem("michi_user");

      // 3. Redirigir a la página principal
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
