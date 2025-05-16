import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем интерсептор для добавления токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data) => api.post('/register/', data),
    login: (data) => api.post('/token/', data),
    getProfile: () => api.get('/profile/'),
};

export const coursesAPI = {
    getAll: () => api.get('/courses/'),
    getMyCourses: () => api.get('/my-courses/'),
    enroll: (courseId) => api.post(`/courses/${courseId}/enroll/`),
    getById: (id) => api.get(`/courses/${id}/`),
};

export const testsAPI = {
    getAll: () => api.get('/tests/'),
    passTest: (testId, data) => api.post(`/tests/${testId}/pass/`, data),
    getMyResults: () => api.get('/my-results/'),
    getByCourse: (courseId) => api.get(`/tests/?course_id=${courseId}`),
};

export const achievementsAPI = {
    getMyAchievements: () => api.get('/my-achievements/'),
};

export default api; 