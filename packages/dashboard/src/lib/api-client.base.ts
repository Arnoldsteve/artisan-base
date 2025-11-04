import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { refreshAccessToken } from "./refresh-token";
import Cookies from "js-cookie";

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
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

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
          // Check if refresh token exists before attempting refresh
          const refreshToken = Cookies.get('refreshToken');
          
          if (!refreshToken) {
            console.error('No refresh token available');
            // Clear all auth data and reject
            this.clearAuthData();
            return Promise.reject(error);
          }

          // If already refreshing, queue this request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await refreshAccessToken();
            console.log("newToken", newToken);
            
            if (newToken) {
              // Save new token
              this.accessToken = newToken;
              // Update header for future requests
              this.client.defaults.headers["Authorization"] = `Bearer ${newToken}`;
              // Retry the failed request with the new token
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              
              // Process all queued requests with the new token
              this.processQueue(null, newToken);
              
              return this.client(originalRequest);
            } else {
              // Refresh failed, process queue with error
              this.processQueue(new Error('Token refresh failed'), null);
              this.clearAuthData();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error('Token refresh error:', refreshError);
            this.processQueue(refreshError, null);
            this.clearAuthData();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
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

  // Process queued requests after token refresh
  private processQueue(error: any = null, token: string | null = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  // Clear auth data from cookies
  private clearAuthData(): void {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('selectedOrgSubdomain');
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