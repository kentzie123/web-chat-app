import axios from "axios";

const api = axios.create({
  baseURL: `https://web-chat-app-server-2ost.onrender.com/api`, // Change to http://localhost:5000/api if using localhost
  withCredentials: true,
});

export default api;