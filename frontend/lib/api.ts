import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper function to extract error message from API response
const getErrorMessage = (error: any): string => {
  const { response } = error;
  
  if (!response) {
    // Network error or server not running
    return 'Unable to connect to server. Please check if the backend is running.';
  }
  
  const { data } = response;
  
  if (data?.detail) {
    // Handle FastAPI validation errors (array of objects)
    if (Array.isArray(data.detail)) {
      // Format validation errors: "msg at loc[0].loc[1]: input"
      return data.detail
        .map((err: any) => {
          const loc = err.loc ? err.loc.join(' -> ').replace('body -> ', '') : 'field';
          return `${err.msg} (at ${loc})`;
        })
        .join('\n');
    }
    // Handle simple string detail
    if (typeof data.detail === 'string') {
      return data.detail;
    }
    // Handle object detail
    if (typeof data.detail === 'object') {
      return data.detail.msg || JSON.stringify(data.detail);
    }
  }
  
  // Handle other error formats
  if (data?.message) {
    return data.message;
  }
  
  return `Error: ${response.status} - ${response.statusText}`;
};

// Handle auth errors and format error messages
api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    // Add formatted error message to the error object
    error.userMessage = getErrorMessage(error);
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (email: string, password: string) =>
    api.post('/api/auth/register', { email, password }),
  
  login: (email: string, password: string) =>
    api.post('/api/auth/login', new URLSearchParams({
      username: email,
      password: password,
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),
  
  getMe: () => api.get('/api/auth/me'),
};

// Risk Analysis API
export const riskApi = {
  analyze: (clause: string) =>
    api.post('/api/risk/analyze', { clause }),
  
  getHistory: () => api.get('/api/risk/history'),
  
  getById: (id: number) => api.get(`/api/risk/${id}`),
};

// Document API
export const documentApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getHistory: () => api.get('/api/documents/history'),
  
  getById: (id: number) => api.get(`/api/documents/${id}`),
  
  delete: (id: number) => api.delete(`/api/documents/${id}`),
};

// Summarizer API
export const summarizeApi = {
  summarize: (text: string, maxLength?: number, minLength?: number) =>
    api.post('/api/summarize', { text, max_length: maxLength, min_length: minLength }),
};

// Entity Extraction API
export const entityApi = {
  extract: (text: string) =>
    api.post('/api/entities/extract', { text }),
  
  getKeyTerms: (text: string) =>
    api.post('/api/entities/terms', { text }),
};

// Document Generator API
export const generatorApi = {
  generateRentalAgreement: (data: {
    landlord_name: string;
    tenant_name: string;
    property_address: string;
    rent_amount: number;
    security_deposit: number;
    duration_months: number;
    start_date: string;
  }) => api.post('/api/generate/rental-agreement', data),
  
  generateNDA: (data: {
    disclosing_party: string;
    receiving_party: string;
    purpose: string;
    duration_years: number;
    effective_date: string;
  }) => api.post('/api/generate/nda', data),
};

// Chat API
export const chatApi = {
  sendMessage: (message: string) =>
    api.post('/api/chat', { message }),
  
  getHistory: () => api.get('/api/chat/history'),
  
  clearHistory: () => api.delete('/api/chat/history'),
};

export default api;

