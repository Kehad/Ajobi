import axios from 'axios';

// The base URL should point to your Laravel backend (e.g. http://localhost:8000)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    // 'Content-Type': 'application/json',
    // 'Accept': 'application/json'
  }
});

// Add a request interceptor to attach the Bearer token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = "F45E1A8D32C6B89E4D2F1A6C3B5E9F7D8A1B2C4E6IDJLSJOE9G1H2I3J4K5L6M7N8ODKJSHSJJ";
        config.headers.Authorization = `Bearer ${token}`;
      }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// Add a response interceptor to standardize error throwing
apiClient.interceptors.response.use(
  (response) => {
    // Some backend endpoints return HTTP 200 but indicate an error in the payload
    if (response.data && (response.data.success === false || response.data.success === "false")) {
      const message = response.data.error?.message || response.data.message || 'An error occurred';
      return Promise.reject(new ApiError(200, message, response.data));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      const message = data?.message || error.message || 'An error occurred';
      return Promise.reject(new ApiError(status, message, data));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new ApiError(0, 'No response from server. Please check your network connection.', null));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new ApiError(0, error.message, null));
    }
  }
);
