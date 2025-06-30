import axios from "axios";
import { getToken } from "../utils/tokenService";

const axiosMenuInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_MENU_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosMenuInstance.interceptors.request.use(
  (config) => {
    const token = getToken("node");
    if (token) {
      // config.headers["authorization"] = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosMenuInstance;