import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1/auth',
  withCredentials: true,
});

export default axiosInstance;
