import axios from 'axios';

const api = axios.create({
    baseURL: window.location.hostname == "localhost" ? "http://localhost:3001" : "http://191.101.81.26:3001",
});

export default api;