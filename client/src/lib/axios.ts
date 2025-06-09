import axios from "axios";

const API_URL = import.meta.env.API_URL;

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api/v1"
      : API_URL,
  withCredentials: true,
});
