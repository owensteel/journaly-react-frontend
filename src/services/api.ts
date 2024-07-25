import axios from 'axios';

const baseURL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://journaly-api.ow.st/';

const api = axios.create({
    baseURL,
});

export default api;
