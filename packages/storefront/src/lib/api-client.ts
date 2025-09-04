// REFACTOR: Centralized API client with caching and error handling for better performance and maintainability

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse, PaginatedResponse } from "@/types";

// OPTIMIZATION: In-memory cache for API responses to reduce redundant requests
class ApiCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // OPTIMIZATION: Batch cache invalidation for related data
  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// REFACTOR: Error handling with specific error types for better debugging
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

// REFACTOR: Centralized API client following Single Responsibility Principle
export class ApiClient {
  private client: AxiosInstance;
  private cache: ApiCache;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_URL!
  ) {
    this.cache = new ApiCache();

    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // <-- Ensure cookies are sent/received
    });

    // Always send x-tenant-id header for local dev
    this.client.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      config.headers["x-tenant-id"] = "satechs"; // <-- set your dev tenant id here
      return config;
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for caching
    this.client.interceptors.request.use(
      (config) => {
        // OPTIMIZATION: Cache GET requests for better performance
        if (config.method === "get" && !config.headers["Cache-Control"]) {
          const cacheKey = this.generateCacheKey(config);
          const cachedData = this.cache.get(cacheKey);
          if (cachedData) {
            return Promise.reject({ __cached: true, data: cachedData });
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling and caching
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // OPTIMIZATION: Cache successful GET responses
        if (response.config.method === "get") {
          const cacheKey = this.generateCacheKey(response.config);
          this.cache.set(cacheKey, response.data, 5 * 60 * 1000); // 5 minutes
        }
        return response;
      },
      (error) => {
        if (error.__cached) {
          return Promise.resolve({ data: error.data, status: 200 });
        }

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

  private generateCacheKey(config: AxiosRequestConfig): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
  }

  // OPTIMIZATION: Generic request method with type safety
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Network error", 0);
    }
  }

  // OPTIMIZATION: Specialized methods for common operations
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: "get", url, params });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: "post", url, data });
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: "put", url, data });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: "delete", url });
  }

  // OPTIMIZATION: Cache management methods
  clearCache(): void {
    this.cache.clear();
  }

  invalidateCache(pattern: string): void {
    this.cache.invalidatePattern(pattern);
  }
}

// OPTIMIZATION: Singleton instance for better performance
export const apiClient = new ApiClient();
