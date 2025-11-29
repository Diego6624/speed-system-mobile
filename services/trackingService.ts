import axios from "axios";

const API_URL = "https://speedsystem-api.onrender.com";

// 🟩 Iniciar recorrido
export const iniciarRecorrido = async (usuarioId: number) => {
  const res = await axios.post(`${API_URL}/recorrido/iniciar`);
  return res.data; // ← contiene { id: recorridoId }
};

// 🟦 Enviar tracking
export const enviarTracking = async (
  recorridoId: number,
  lat: number,
  lng: number,
  velocidad: number
) => {
  await axios.post(`${API_URL}/recorrido/${recorridoId}/tracking`, {
    lat,
    lng,
    velocidad,
  });
};

// 🟥 Finalizar recorrido
export const finalizarRecorrido = async (recorridoId: number) => {
  const res = await axios.put(`${API_URL}/recorrido/${recorridoId}/finalizar`);
  return res.data;
};