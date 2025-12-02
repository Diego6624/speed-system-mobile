import axios from "axios";
import * as SecureStore from "expo-secure-store"; // o AsyncStorage si lo usas

const API_URL = "https://speedsystem-api.onrender.com";

// Helper para obtener el token
const getAuthHeader = async () => {
  const token = await SecureStore.getItemAsync("token"); // donde guardaste el token
  return { Authorization: `Bearer ${token}` };
};

// 🟩 Iniciar recorrido
export const iniciarRecorrido = async () => {
  const headers = await getAuthHeader();
  console.log("🔐 Header enviado:", headers); // ← esto debe mostrar el token

  const res = await axios.post(`${API_URL}/recorrido/iniciar`, {}, { headers });
  return res.data;
};

// 🟦 Enviar tracking
export const enviarTracking = async (
  recorridoId: number,
  lat: number,
  lng: number,
  velocidad: number
) => {
  const headers = await getAuthHeader();
  await axios.post(
    `${API_URL}/recorrido/${recorridoId}/tracking`,
    { lat, lng, velocidad },
    { headers }
  );
};

// 🟥 Finalizar recorrido
export const finalizarRecorrido = async (recorridoId: number) => {
  const headers = await getAuthHeader();
  const res = await axios.put(
    `${API_URL}/recorrido/${recorridoId}/finalizar`,
    {},
    { headers }
  );
  return res.data;
};
