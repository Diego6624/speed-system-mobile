import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const API_URL = "https://speedsystem-api.onrender.com";

interface AuthContextType {
  token: string | null;
  user: any;
  loading: boolean;
  loginUser: (correo: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // 🔄 Cargar token al iniciar APP
  // -------------------------
  useEffect(() => {
    const loadSession = async () => {
      const savedToken = await AsyncStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        await fetchUser(savedToken);
      }

      setLoading(false);
    };

    loadSession();
  }, []);

  // -------------------------
  // 📌 Obtener datos del usuario
  // -------------------------
  const fetchUser = async (token: string) => {
    try {
      const res = await axios.get(`${API_URL}/usuario/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      return res.data;
    } catch (err) {
      console.log("Error obteniendo usuario:", err);
      return null;
    }
  };

  // -------------------------
  // 🔐 LOGIN
  // -------------------------
  const loginUser = async (correo: string, password: string) => {
    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/auth/login`, { correo, password });
      const t = res.data.token;

      setToken(t);
      await AsyncStorage.setItem("token", t);

      const usuario = await fetchUser(t);
      if (!usuario) return false;

      return true;
    } catch (error) {
      console.log("Error en login:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // 🚪 LOGOUT
  // -------------------------
  const logoutUser = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
