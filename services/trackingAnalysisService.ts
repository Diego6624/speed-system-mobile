import axios from "axios";

const API_URL = "https://speedsystem-api.onrender.com";

// Obtener análisis semanal
export const getWeeklyStats = async (token: string) => {
  const res = await axios.get(`${API_URL}/recorrido/analisis`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Obtener historial de recorridos
export const getMyTrips = async (token: string) => {
  const res = await axios.get(`${API_URL}/recorrido/historial`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};