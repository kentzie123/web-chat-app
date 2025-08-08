import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Change to http://localhost:5000/api if using localhost
  withCredentials: true,
});

export default api;