import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Token inválido ou expirado. Redirecionando para login...");
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Erro interno do servidor. Tente novamente mais tarde.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Timeout da requisição. Tente novamente.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
