import axios from 'axios';

const api = axios.create({
    baseURL: window.location.hostname == "localhost" ? "http://localhost:3001" : "https://journaly-api.ow.st/",
});

export default api;