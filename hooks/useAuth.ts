import { login } from "@/services/api";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const loginUser = async (correo: string, password: string) => {
    try {
      setLoading(true);
      const data = await login(correo, password);

      if (data.token) {
        await SecureStore.setItemAsync("token", data.token);
        return true;
      }

      return false;
    } catch (error) {
      console.log("Error en login:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await SecureStore.deleteItemAsync("token");
  };

  return {
    loading,
    loginUser,
    logoutUser,
  };
};
