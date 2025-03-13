import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  // Bỏ qua lỗi SSL nếu dùng self-signed certificate (chỉ dùng cho development)
  httpsAgent: process.env.NODE_ENV === 'development' 
    ? new (require('https').Agent)({ rejectUnauthorized: false })
    : undefined
});

// Interceptors
axiosInstance.interceptors.request.use((config) => {
  // Thêm token vào header
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Thêm interceptor để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // Lỗi từ server
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      // Lỗi không có response
      console.error('No response received:', error.request);
    } else {
      // Lỗi khi setup request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 