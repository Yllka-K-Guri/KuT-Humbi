import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:8000/api'
  : 'http://10.11.101.38:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);
export const logout = (token) => api.post('/logout', {}, {
  headers: { Authorization: `Bearer ${token}` }
});

// Posts
export const getPosts = (params, token) => api.get('/posts', {
  params,
  headers: { Authorization: `Bearer ${token}` }
});

export const getPost = (id, token) => api.get(`/posts/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

export const createPost = (data, token) => {
  const formData = new FormData();
  
  formData.append('post_type', data.post_type);
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('city', data.city);
  formData.append('incident_date', data.incident_date);
  formData.append('category_id', data.category_id);
  
  if (data.photo) {
    formData.append('photo', {
      uri: data.photo,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
  }

  return api.post('/posts', formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const getMyPosts = (token) => api.get('/my-posts', {
  headers: { Authorization: `Bearer ${token}` }
});

// Categories
export const getCategories = () => api.get('/categories');

export default api;