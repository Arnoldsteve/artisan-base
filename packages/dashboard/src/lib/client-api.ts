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

  // Public methods to manage state during the app's lifecycle
  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public setTenantId(id: string | null) {
    this.tenantId = id;
  }

  private setupClientInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        if (this.tenantId) {
          config.headers["x-tenant-id"] = this.tenantId;
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
