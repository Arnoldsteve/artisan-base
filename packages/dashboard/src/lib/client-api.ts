import { AxiosRequestConfig, AxiosResponse } from "axios";
import { BaseApiClient, ApiError } from "./api-client.base";

export { ApiError };

export class ApiClient extends BaseApiClient {
  private authToken: string | null = null;
  private tenantId: string | null = null;

  constructor() {
    super();
    this.setupClientInterceptors();
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public setTenantId(id: string | null) {
    this.tenantId = id;
  }

  /**
   * Reads a cookie value by name.
   * Safe to call — returns null if not in browser or cookie not found.
   */
  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  }

  private setupClientInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        // --- Auth Token ---
        // Read from memory first, fall back to cookie
        const token =
          this.authToken || this.getCookie("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // --- Tenant ID ---
        // Read from memory first, fall back to cookie
        // Uses subdomain (selectedOrgSubdomain) as the x-tenant-id header value
        const tenantId =
          this.tenantId || this.getCookie("selectedTenantId");
        if (tenantId) {
          config.headers["x-tenant-id"] = tenantId;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => Promise.reject(error)
    );
  }
}

export const apiClient = new ApiClient();