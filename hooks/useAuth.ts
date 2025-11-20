import { getUsuarioActual, login } from "@/services/api";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const loginUser = async (correo: string, password: string) => {
    try {
      setLoading(true);

      // 1. Login → token
      const data = await login(correo, password);

      if (!data.token) return false;

      await SecureStore.setItemAsync("token", data.token);

      // 2. Obtener datos del usuario con el token
      const usuario = await getUsuarioActual(data.token);

      setUser(usuario); // 👈 ahora si tendrás user.id disponible

      return true;
    } catch (error) {
      console.log("Error en login:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await SecureStore.deleteItemAsync("token");
    setUser(null);
  };

  return {
    loading,
    user,
    loginUser,
    logoutUser,
  };
};
