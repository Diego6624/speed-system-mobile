import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://speedsystem-api.onrender.com";

// ======================================
// 🔐 Inserta token en axios automáticamente
// ======================================
export const setAuthToken = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const getUsuarioActual = async (token: string) => {
  const res = await axios.get(`${API_URL}/usuario/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data; // { id, nombre, correo, ... }
};

export const login = async (correo: string, password: string) => {
  const res = await axios.post(
    `${API_URL}/auth/login`,
    { correo, password },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }
  );
  return res.data;
};

export const getUserMe = async () => {
  await setAuthToken(); // asegura el token

  const res = await axios.get(`${API_URL}/usuario/me`);
  return res.data; // { id, correo, nombre, apellido, ... }
};