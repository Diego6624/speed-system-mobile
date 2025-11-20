import axios from "axios";

const API_URL = "https://speedsystem-api.onrender.com";

export const obtenerLimiteVelocidad = async (lat: number, lon: number) => {
  try {
    const res = await axios.get(`${API_URL}/zona/velocidad?lat=${lat}&lon=${lon}`);
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
}