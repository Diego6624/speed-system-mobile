import axios from "axios";

const API_URL = "https://speedsystem-api.onrender.com";

// Obtener análisis semanal
export const getWeeklyStats = async (token: string) => {
  const res = await axios.get(`${API_URL}/api/trips/my/weekly-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Obtener historial de recorridos
export const getMyTrips = async (token: string) => {
  const res = await axios.get(`${API_URL}/api/trips/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};