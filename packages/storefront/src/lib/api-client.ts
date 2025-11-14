import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Error class remains the same
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  ) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Add tenant header
    this.client.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      config.headers["x-tenant-id"] = "satechs";
      return config;
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError = new ApiError(
          error.response?.data?.message || error.message,
          error.response?.status || 500,
          error.response?.data?.code,
          error.response?.data
        );

        return Promise.reject(apiError);
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Network error", 0);
    }
  }

  get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: "get", url, params });
  }

  post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: "post", url, data });
  }

  put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: "put", url, data });
  }

  delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: "delete", url });
  }
}

export const apiClient = new ApiClient();
