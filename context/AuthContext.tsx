import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  loginUser: (correo: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);

  const loginUser = async (correo: string, password: string) => {
    try {
      const res = await axios.post(
        "https://speedsystem-api.onrender.com/auth/login",
        { correo, password }
      );

      const token = res.data.token;

      setToken(token);
      await AsyncStorage.setItem("token", token);

      return true;
    } catch (error) {
      console.log("Error login:", error);
      return false;
    }
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
