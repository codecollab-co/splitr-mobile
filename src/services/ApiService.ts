import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configService } from './ConfigService';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

class ApiServiceClass {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: configService.apiBaseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Database-Mode': configService.databaseMode,
        'X-Environment': configService.environment,
      },
    });

    this.setupInterceptors();
    this.loadTokenFromStorage();

    configService.log('info', `ApiService initialized for ${configService.environment} environment`, {
      baseURL: configService.apiBaseUrl,
      databaseMode: configService.databaseMode,
    });
  }

  private async loadTokenFromStorage() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        this.token = token;
        configService.log('debug', 'Auth token loaded from storage');
      }
    } catch (error) {
      configService.log('error', 'Failed to load token from storage', error);
    }
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Add database mode header for backend to route appropriately
        config.headers['X-Database-Mode'] = configService.databaseMode;
        config.headers['X-Environment'] = configService.environment;

        configService.log('debug', `API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          databaseMode: configService.databaseMode,
          hasAuth: !!this.token,
        });

        return config;
      },
      (error) => {
        configService.log('error', 'Request interceptor error', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        configService.log('debug', `API Response: ${response.status}`, {
          url: response.config.url,
          success: response.data.success,
        });
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          configService.log('warn', 'Unauthorized request - clearing token');
          this.clearToken();
        }

        configService.log('error', 'API Error', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.response?.data?.error || error.message,
        });

        return Promise.reject(error);
      }
    );
  }

  async setToken(token: string) {
    this.token = token;
    try {
      await AsyncStorage.setItem('auth_token', token);
      configService.log('debug', 'Auth token saved to storage');
    } catch (error) {
      configService.log('error', 'Failed to save token to storage', error);
    }
  }

  async clearToken() {
    this.token = null;
    try {
      await AsyncStorage.removeItem('auth_token');
      configService.log('debug', 'Auth token cleared from storage');
    } catch (error) {
      configService.log('error', 'Failed to remove token from storage', error);
    }
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const adaptedUrl = configService.getApiPath(url);
    const response = await this.client.get<ApiResponse<T>>(adaptedUrl, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const adaptedUrl = configService.getApiPath(url);
    const response = await this.client.post<ApiResponse<T>>(adaptedUrl, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const adaptedUrl = configService.getApiPath(url);
    const response = await this.client.put<ApiResponse<T>>(adaptedUrl, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const adaptedUrl = configService.getApiPath(url);
    const response = await this.client.patch<ApiResponse<T>>(adaptedUrl, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const adaptedUrl = configService.getApiPath(url);
    const response = await this.client.delete<ApiResponse<T>>(adaptedUrl);
    return response.data;
  }

  // File upload helper with environment awareness
  async uploadFile(
    url: string,
    file: {
      uri: string;
      type: string;
      name: string;
    },
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<any>> {
    const adaptedUrl = configService.getApiPath(url);
    const formData = new FormData();
    formData.append('file', file as any);

    const response = await this.client.post<ApiResponse<any>>(adaptedUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      },
    });

    return response.data;
  }

  // Health check with database mode awareness
  async checkHealth(): Promise<{
    api: boolean;
    database: boolean;
    environment: string;
    databaseMode: string;
  }> {
    try {
      const response = await this.client.get('/health', { timeout: 5000 });

      const result = {
        api: response.status === 200,
        database: response.data?.database === 'connected',
        environment: configService.environment,
        databaseMode: configService.databaseMode,
      };

      configService.log('info', 'Health check completed', result);
      return result;
    } catch (error) {
      configService.log('error', 'Health check failed', error);
      return {
        api: false,
        database: false,
        environment: configService.environment,
        databaseMode: configService.databaseMode,
      };
    }
  }

  // Get socket URL from config service
  getSocketUrl(): string {
    return configService.socketUrl;
  }

  // Database-specific query methods
  async query<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
      params?: any;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', data, params } = options;

    switch (method) {
      case 'GET':
        return this.get<T>(endpoint, params);
      case 'POST':
        return this.post<T>(endpoint, data);
      case 'PUT':
        return this.put<T>(endpoint, data);
      case 'DELETE':
        return this.delete<T>(endpoint);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  // Environment-specific optimizations
  async optimizedQuery<T>(
    endpoint: string,
    data?: any,
    options: {
      useCache?: boolean;
      priority?: 'high' | 'normal' | 'low';
    } = {}
  ): Promise<ApiResponse<T>> {
    if (configService.isLocalDatabase) {
      // PostgreSQL: Use direct queries
      return this.post<T>(endpoint, data);
    } else {
      // Convex: Use optimized queries with real-time features
      return this.post<T>(`${endpoint}?optimized=true`, {
        ...data,
        _convexOpts: {
          cache: options.useCache !== false,
          priority: options.priority || 'normal',
        },
      });
    }
  }

  // Get configuration info for debugging
  getConfig(): any {
    return {
      baseURL: this.client.defaults.baseURL,
      environment: configService.environment,
      databaseMode: configService.databaseMode,
      hasToken: !!this.token,
    };
  }
}

export const apiService = new ApiServiceClass();