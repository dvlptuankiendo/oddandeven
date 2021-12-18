import axios from "axios";

export const ACCESS_TOKEN = "ACCESS_TOKEN";

export const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:8888";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN) || null;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export const logIn = (username, password) =>
  api.post("/api/v1/account/logIn", { username, password });

export const signUp = (username, password) =>
  api.post("/api/v1/account/register", { username, password });

export const getInfo = () => api.get("/api/v1/account/me");
