import axios from "axios";

const API_URL = "https://speedsystem-api.onrender.com";

export const register = async (
  nombre: string,
  apellido: string,
  correo: string,
  password: string
) => {
  const res = await axios.post(`${API_URL}/auth/register`, {
    nombre,
    apellido,
    correo,
    password,
  });
  return res.data; // ← token
};