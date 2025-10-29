import axios, { AxiosError } from "axios";

export const apiRegister = async (
  email: string,
  name: string,
  password: string
) => {
  const response = await axios.post("/api/auth/register", {
    email,
    name,
    password,
  });
  return response.data;
};

export const apiCheckEmail = async (email: string) => {
  const response = await axios.post("/api/auth/check-email", {
    email,
  });
  return response.data;
};

export const apiLogin = async (email: string, password: string) => {
  const response = await axios.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};
