import axios from "axios";

const API_URL = "https://speedsystem-api.onrender.com";

export const getWeeklyStats = async () => {
  const res = await axios.get(`${API_URL}/api/trips/my/weekly-stats`);
  return res.data;
};

// Obtener historial de recorridos
export const getMyTrips = async () => {
  const res = await axios.get(`${API_URL}/api/trips/my`);
  return res.data;
};