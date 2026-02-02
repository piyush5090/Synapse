import api from '../../services/api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const signup = async (credentials) => {
  const response = await api.post('/auth/signup', credentials);
  return response.data;
};

export const getBusiness = async () => {
  const response = await api.get('/business');
  return response.data;
};

export const createOrUpdateBusiness = async (businessData) => {
  const response = await api.post('/business', businessData);
  return response.data;
};
