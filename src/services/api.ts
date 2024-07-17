import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001', // Adjust based on your backend URL
});

export default api;
