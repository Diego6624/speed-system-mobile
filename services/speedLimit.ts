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
    const limite = res.data?.limiteVelocidad;

    if (typeof limite === "number") {
      console.log("✅ Límite obtenido:", limite);
      return limite;
    } else {
      console.warn("⚠️ Backend no devolvió límite, usando fallback 40.");
      return 40; // fallback extra en el front (por seguridad)
    }
  } catch (err) {
    console.error("❌ Error obteniendo límite de velocidad:", err);
    return 40; // fallback si falla la llamada
  }
};
