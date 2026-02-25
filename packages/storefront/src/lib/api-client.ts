import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Error class for consistent error handling across the platform
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
  private tenantId: string | null = null; // State for dynamic isolation

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  ) {
    this.client = axios.create({
      baseURL: `${baseURL}/api/v1`, // Standardized base path
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    /**
     * TOP 1% ARCHITECTURE: Dynamic Header Interceptor
     * This interceptor injects the current tenant context into 
     * every single outgoing request automatically.
     */
    this.client.interceptors.request.use((config) => {
      if (this.tenantId) {
        config.headers["x-tenant-id"] = this.tenantId;
      }
      return config;
    });

    this.setupInterceptors();
  }

  /**
   * Called by the TenantProvider once a URL slug is resolved.
   */
  public setTenantId(id: string | null): void {
    this.tenantId = id;
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

  patch<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'patch', url, data });
  }

  delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: "delete", url });
  }
}

export const apiClient = new ApiClient();