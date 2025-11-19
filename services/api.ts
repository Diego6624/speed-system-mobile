import axios from "axios";

const API_URL = "https://speedsystem-api.onrender.com";

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