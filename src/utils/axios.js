import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8002/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
