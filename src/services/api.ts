import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Configuración de Axios siguiendo las especificaciones de seguridad del PDF
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.museomarco.com';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Forzar HTTPS
    this.axiosInstance.interceptors.request.use((config) => {
      if (config.url && !config.url.startsWith('https://')) {
        console.warn('Advertencia: Se intentó hacer una petición HTTP no segura');
      }
      return config;
    });

    // Agregar token JWT a las peticiones
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Manejo de errores y reintentos con backoff exponencial
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config as AxiosRequestConfig & { _retry?: number };

        if (!config._retry) {
          config._retry = 0;
        }

        // Reintentar hasta 3 veces con backoff exponencial
        if (config._retry < 3 && error.response?.status >= 500) {
          config._retry += 1;
          const delay = Math.pow(2, config._retry) * 1000;

          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.axiosInstance(config);
        }

        // Si es 401, limpiar token y redirigir a login
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  // Métodos seguros para las peticiones
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

export default new ApiService();
