import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url;
            // Do not redirect or show error if the request was to /login or /me
            if (url && (url.includes('/api/auth/login') || url.includes('/api/auth/me'))) {
                console.warn(`API 401: Expected unauthenticated response from ${url}`);
            } else {
                console.error('API Error 401: Unauthorized. Redirecting to login...');
                window.location.href = '/login';
            }
        } else if (error.response?.status === 403) {
            console.error('API Error 403: Forbidden. User lacks required roles.');
        } else if (error.response?.status === 500) {
            if (import.meta.env.DEV) {
                console.error('API Error 500:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);
