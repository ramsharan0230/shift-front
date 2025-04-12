import axios from 'axios';
import ApiService from '../utils/ApiService';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  const axiosInstance = axios.create({
    baseURL: config.public.baseURL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  axiosInstance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const token = authStore.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      const authStore = useAuthStore();
      
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const { data } = await axios.post(`${config.public.baseURL}/auth/refresh`, {
            refresh_token: authStore.refreshToken
          });
          
          authStore.token = data.token;
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          authStore.logout(axiosInstance);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const api = new ApiService(axiosInstance);

  return {
    provide: {
      axios: axiosInstance,
      api
    }
  };
});