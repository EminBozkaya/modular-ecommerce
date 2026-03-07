import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Do not redirect if the request was to /login or /me, otherwise it causes infinite loops
            const url = error.config?.url;
            if (url && !url.includes('/api/auth/login') && !url.includes('/api/auth/me')) {
                window.location.href = '/login';
            }
        } else if (error.response?.status === 500) {
            if (import.meta.env.DEV) {
                console.error('API Error 500:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);
