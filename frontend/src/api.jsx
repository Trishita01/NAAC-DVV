// axios.js
import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, logout } from './tokenUtils';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const t = getAccessToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(res => res, async error => {
  const orig = error.config;
  if (error.response?.status === 401 && !orig._retry) {
    orig._retry = true;
    try {
      const rt = getRefreshToken();
      const resp = await axios.post('/refresh', { refreshToken: rt });
      setTokens(resp.data.accessToken, resp.data.refreshToken);
      orig.headers.Authorization = `Bearer ${resp.data.accessToken}`;
      return api(orig);
    } catch (e) {
      logout();
    }
  }
  return Promise.reject(error);
});

export default api;
