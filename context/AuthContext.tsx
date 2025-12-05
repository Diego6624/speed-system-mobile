import axios from "axios";
import * as SecureStore from "expo-secure-store";
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

  useEffect(() => {
    const loadSession = async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      if (savedToken) {
        setToken(savedToken);
        await fetchUser(savedToken);
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await axios.get(`${API_URL}/usuario/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.log("Error obteniendo usuario:", error);
      setUser(null);
      return null;
    }
  };

  const loginUser = async (correo: string, password: string) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/login`, { correo, password });
      const t = res.data.token;

      if (!t) {
        console.log("Login sin token válido");
        return false;
      }

      await SecureStore.setItemAsync("token", t);
      setToken(t);

      const usuario = await fetchUser(t);
      return !!usuario;
    } catch (error) {
      console.log("Error en login:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await SecureStore.deleteItemAsync("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
