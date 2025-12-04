import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://speedsystem-api.onrender.com";

const getAuthHeader = async () => {
  const token = await SecureStore.getItemAsync("token");
  return { Authorization: `Bearer ${token}` };
};

export const getWeeklyStats = async () => {
  const headers = await getAuthHeader();
  const res = await axios.get(`${API_URL}/api/trips/my/weekly-stats`, { headers });
  return res.data;
};

export const getMyTrips = async () => {
  const headers = await getAuthHeader();
  const res = await axios.get(`${API_URL}/api/trips/my`, { headers });
  return res.data;
};