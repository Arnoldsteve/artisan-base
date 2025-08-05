// File: packages/dasboard/src/lib/client-api.ts

import { AxiosRequestConfig, AxiosResponse } from "axios";
import { BaseApiClient, ApiError } from "./api-client.base";

// Re-export ApiError so other parts of the app can import it from this central file.
export { ApiError };

// --- CACHING LOGIC (Client-Side Only) ---
class ApiCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void { // Default 5 min TTL
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

  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      // e.g., if pattern is 'orders', invalidate all keys including '/orders'
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// --- EXTENDED CLIENT-SIDE API CLIENT ---
export class ApiClient extends BaseApiClient {
  private cache: ApiCache;
  private authToken: string | null = null;
  private tenantId: string | null = null;

  constructor() {
    // Call the parent constructor with no initial config,
    // as auth/tenant info will be set dynamically.
    super(); 
    this.cache = new ApiCache();
    this.setupClientInterceptors();
  }

  // Public methods to manage state during the app's lifecycle
  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public setTenantId(id: string | null) {
    this.tenantId = id;
  }

  private setupClientInterceptors(): void {
    // --- Request Interceptor for Dynamic Headers & Caching ---
    this.client.interceptors.request.use(
      (config) => {
        // Add dynamic headers for client-side navigation
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        if (this.tenantId) {
          config.headers["x-tenant-id"] = this.tenantId;
        }

        // Check cache for GET requests
        if (config.method === "get" && !config.headers["Cache-Control"]) {
          const cacheKey = this.generateCacheKey(config);
          const cachedData = this.cache.get(cacheKey);
          if (cachedData) {
            // If found, short-circuit the request by rejecting with a special flag
            return Promise.reject({ __cached: true, data: cachedData });
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // --- Response Interceptor for Storing in Cache ---
    // Note: The error handling part is already in the BaseApiClient
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Cache successful GET responses
        if (response.config.method === "get") {
          const cacheKey = this.generateCacheKey(response.config);
          this.cache.set(cacheKey, response.data);
        }
        return response;
      },
      (error) => {
        // Handle the special __cached rejection from the request interceptor
        if (error.__cached) {
          return Promise.resolve({ data: error.data, status: 200, statusText: 'OK (from cache)', headers: {}, config: {} as AxiosRequestConfig });
        }
        // For all other errors, let the base interceptor handle it
        return Promise.reject(error);
      }
    );
  }

  private generateCacheKey(config: AxiosRequestConfig): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
  }

  // Public methods for cache management
  public clearCache(): void {
    this.cache.clear();
  }

  public invalidateCache(pattern: string): void {
    this.cache.invalidatePattern(pattern);
  }
}

// Singleton instance for all CLIENT-SIDE use (hooks, components, services)
export const apiClient = new ApiClient();