import axios from "axios";

const API_URL = "https://speedsystem-api.onrender.com";

export const login = async (correo: string, password: string) => {
  const res = await axios.post(`${API_URL}/auth/login`, {
    correo,
    password,
  });

  return res.data; // { token: "xxxx" }
};
