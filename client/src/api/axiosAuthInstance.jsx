import axios from "axios";
import { getToken } from "../utils/tokenService";

const axiosAuthInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuthInstance.interceptors.request.use(
  (config) => {
    const token = getToken("laravel");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosAuthInstance;
