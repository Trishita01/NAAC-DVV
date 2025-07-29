import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1/auth',
  withCredentials: true, // Enable cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to modify the URL path
api.interceptors.request.use(
  (config) => {
    // For auth endpoints, remove the auth prefix since it's already in baseURL
    if (config.url?.startsWith('/auth/')) {
      config.url = config.url.replace('/auth/', '/');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a request interceptor to include the token from cookies
api.interceptors.request.use(
  (config) => {
    // The token is automatically included from cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh if needed
      try {
        const refreshResponse = await api.post('/auth/refreshAccessToken');
        if (refreshResponse.data.success) {
          // Retry the original request with new token
          return api.request(error.config);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
