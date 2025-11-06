import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// The custom error class is shared logic.
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

// This is the core, reusable class.
export class BaseApiClient {
  protected client: AxiosInstance;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    initialConfig: { token?: string | null; tenantId?: string | null } = {}
  ) {
    this.client = axios.create({
      baseURL: `${baseURL}/api/v1`,
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
        // Set headers from constructor - perfect for the server client
        ...(initialConfig.token && { Authorization: `Bearer ${initialConfig.token}` }),
        ...(initialConfig.tenantId && { "x-tenant-id": initialConfig.tenantId }),
      },
      withCredentials: true,
    });

    // Shared error handling for both client and server!
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response, // Pass through successful responses
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

  // All request methods are shared.
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("An unknown network error occurred", 0);
    }
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: "get", url, params });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: "post", url, data });
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'patch', url, data });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: "delete", url });
  }
}