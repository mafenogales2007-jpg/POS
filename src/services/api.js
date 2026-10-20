import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // O tu URL de producción en despliegue
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para enviar el token JWT automáticamente si el usuario ha iniciado sesión
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;