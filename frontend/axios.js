import axios from "axios";

const baseURLAPI = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: baseURLAPI,
  withCredentials: true,
});

export default axiosInstance;