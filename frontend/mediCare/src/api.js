import axios from "axios";

const api = axios.create({
  baseURL: "https://saathicare-backend.onrender.com/api",
});

export default api;