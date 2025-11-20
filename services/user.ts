import axios from "axios";
const API_URL = "https://speedsystem-api.onrender.com";

export const getUsuarioMe = async (token: string) => {
  const res = await axios.get(`${API_URL}/usuario/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUsuario = async (token: string, usuario: any) => {
  const res = await axios.put(`${API_URL}/usuario/update`, usuario, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
