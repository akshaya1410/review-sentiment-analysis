import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const predictSentiment = async (reviewText, domain = 'movie') => {
  const response = await apiClient.post('/api/predict', { review: reviewText, domain });
  return response.data;
};

export const sendChatbotReview = async (reviewText, customerName = 'Valued Guest', domain = 'restaurant') => {
  const response = await apiClient.post('/api/chatbot/respond', {
    review: reviewText,
    customer_name: customerName,
    domain: domain
  });
  return response.data;
};

export const getDashboardStats = async (domain = 'movie') => {
  const response = await apiClient.get('/api/dashboard/stats', { params: { domain } });
  return response.data;
};

export const getModelMetrics = async (domain = 'movie') => {
  const response = await apiClient.get('/api/models', { params: { domain } });
  return response.data;
};

export const uploadBatch = async (file, domain = 'movie') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('domain', domain);
  const response = await apiClient.post('/api/batch-predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getHistory = async (domain = null) => {
  const response = await apiClient.get('/api/history', { params: domain ? { domain } : {} });
  return response.data;
};

export const clearHistory = async (domain = null) => {
  const response = await apiClient.delete('/api/history', { params: domain ? { domain } : {} });
  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get('/api/health');
  return response.data;
};

export default {
  predictSentiment,
  sendChatbotReview,
  getDashboardStats,
  getModelMetrics,
  uploadBatch,
  getHistory,
  clearHistory,
  checkHealth,
};
