import axios from 'axios';
import { store } from '../app/store';

const api = axios.create({
  baseURL: 'https://synapse-backend-uuoe.onrender.com/api',
  //baseURL: 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = store.getState().user.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
