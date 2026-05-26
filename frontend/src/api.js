import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // API Gateway

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// Expenses
export const getExpenses = (userId) => api.get(`/expenses?userId=${userId}`);
export const addExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Budgets
export const getBudgets = (userId) => api.get(`/budgets?userId=${userId}`);
export const createBudget = (data) => api.post('/budgets', data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

// Analytics
export const getAnalytics = (userId) => api.get(`/analytics?userId=${userId}`);
export const getMonthlySummary = (userId) => api.get(`/analytics/monthly-summary?userId=${userId}`);
