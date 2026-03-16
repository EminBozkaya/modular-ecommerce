import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Send the user's selected language with every request so the backend
// returns translated product/category names via Accept-Language.
apiClient.interceptors.request.use((config) => {
    const lang = localStorage.getItem('language') ?? 'tr';
    config.headers['Accept-Language'] = lang;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            const url = originalRequest.url;
            // Do not retry or show error if the request was to /login or /me or /refresh
            if (url && (url.includes('/api/auth/login') || url.includes('/api/auth/me') || url.includes('/api/auth/refresh'))) {
                if (!url.includes('/api/auth/login')) {
                    console.warn(`API 401: Expected unauthenticated response from ${url}`);
                }
            } else {
                originalRequest._retry = true;
                try {
                    console.log('Attempting token refresh...');
                    await apiClient.post('/api/auth/refresh');
                    console.log('Token refresh successful. Retrying request:', url);
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed. Redirecting to login...');
                    window.location.href = '/login';
                }
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
