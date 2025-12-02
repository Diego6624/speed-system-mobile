import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://speedsystem-api.onrender.com";

const getAuthHeader = async () => {
  const token = await SecureStore.getItemAsync("token");
  return { Authorization: `Bearer ${token}` };
};

export const obtenerLimiteVelocidad = async (lat: number, lon: number) => {
  try {
    const headers = await getAuthHeader();
    const res = await axios.get(`${API_URL}/zona/velocidad?lat=${lat}&lon=${lon}`, { headers });
    const limite = res.data?.limiteVelocidad ?? null;

    if (limite !== null) {
      console.log("Límite obtenido:", limite);
      return limite;
    } else {
      console.log("Sin límite OSM encontrado (null).");
      return null;
    }
  } catch (err) {
    console.error("❌ Error obteniendo límite de velocidad:", err);
    return null;
  }
};
