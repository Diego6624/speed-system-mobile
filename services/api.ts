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

// 🟩 Iniciar recorrido
export const iniciarRecorrido = async (usuarioId: number) => {
  const res = await axios.post(`${API_URL}/recorrido/iniciar/${usuarioId}`);
  return res.data; // ← contiene { id: recorridoId }
};

// 🟦 Enviar tracking
export const enviarTracking = async (
  recorridoId: number,
  latitud: number,
  longitud: number,
  velocidad: number
) => {
  await axios.post(`${API_URL}/recorrido/${recorridoId}/tracking`, {
    latitud,
    longitud,
    velocidad,
  });
};

// 🟥 Finalizar recorrido
export const finalizarRecorrido = async (recorridoId: number) => {
  await axios.put(`${API_URL}/recorrido/${recorridoId}/finalizar`);
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