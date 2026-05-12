 import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getCars = (params) => api.get('/cars/', { params });
export const getCar = (id) => api.get(`/cars/${id}/`);
export const createCommissionRequest = (data) => api.post('/commission-requests/', data);
export const createTestDriveRequest = (data) => api.post('/test-drives/', data); // Path changed from /test-drive-requests/ to /test-drives/

// Admin endpoints
export const getTestDriveRequests = () => api.get('/test-drives/');
export const updateTestDriveRequest = (id, data) => api.patch(`/test-drives/${id}/`, data);
export const getCommissionRequests = () => api.get('/commission-requests/');
export const updateCommissionRequest = (id, data) => api.patch(`/commission-requests/${id}/`, data);

export const getNews = () => api.get('/marketing/news/');
export const getPromotions = () => api.get('/marketing/promotions/');
export const getReviews = () => api.get('/marketing/reviews/');
export const createReview = (data) => api.post('/marketing/reviews/', data);
export const getDashboardData = () => api.get('/users/dashboard/');

export default api;
