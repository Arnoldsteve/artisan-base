import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { refreshAccessToken } from "./refresh-token";

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

export class BaseApiClient {
  protected client: AxiosInstance;
  private accessToken?: string | null;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    initialConfig: { token?: string | null; tenantId?: string | null } = {}
  ) {
    this.accessToken = initialConfig.token;

    this.client = axios.create({
      baseURL: `${baseURL}/api/v1`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        ...(initialConfig.tenantId && { "x-tenant-id": initialConfig.tenantId }),
      },
      withCredentials: true,
    });

    // ✅ Response interceptor for automatic token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        // Only retry once to prevent infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const newToken = await refreshAccessToken();
          console.log("newToken", newToken)
          if (newToken) {
            // Save new token
            this.accessToken = newToken;
            // Update header for future requests
            this.client.defaults.headers["Authorization"] = `Bearer ${newToken}`;
            // Retry the failed request with the new token
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return this.client(originalRequest);
          }
        }

        // Normal error handling
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

  // ✅ Optional method to update token manually (after login)
  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      this.client.defaults.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers["Authorization"];
    }
  }

  // --- Standard request methods ---
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
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
    return this.request<T>({ method: "patch", url, data });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: "delete", url });
  }
}
