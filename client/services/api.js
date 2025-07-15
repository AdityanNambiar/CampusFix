import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const api = axios.create({
  baseURL: '/'
});

// Helper to get token from memory or localStorage
let memoryToken = null;
export const setMemoryToken = (token) => { memoryToken = token; };

// Helper to set forceLogout callback
let forceLogoutCb = null;
export const setForceLogoutCb = (cb) => { forceLogoutCb = cb; };

// Helper to get token from correct storage (localStorage preferred)
const getStoredToken = () => {
  let token = localStorage.getItem('token');
  if (!token) token = sessionStorage.getItem('token');
  return token;
};

api.interceptors.request.use(config => {
  // Always attach token from correct storage
  const token = getStoredToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (forceLogoutCb) forceLogoutCb();
    }
    return Promise.reject(error);
  }
);

// Verify token with backend
export const verifyToken = async () => {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const res = await api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.user;
  } catch (err) {
    return null;
  }
};

export default api; 