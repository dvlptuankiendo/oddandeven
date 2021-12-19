import axios from "axios";

import { host, ACCESS_TOKEN } from "../utils/constants";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN) || null;

const api = axios.create({
  baseURL: host,
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

export const getResults = () => api.get("/api/v1/results");

export const getActiveBetting = () => api.get("/api/v1/bet/active");

export const createBet = (data) => api.post("/api/v1/bet/createABet", data);

export const getRanking = () => api.get("/api/v1/ranking/daily");
