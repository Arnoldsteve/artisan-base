import { apiClient } from "@/lib/client-api";
import {
  LoginDto,
  SignUpDto,
  LoginResponse,
  ForgotPassword,
  ResetPassword,
  ProfileResponse,
} from "@/types/auth";

export class AuthService {
  /**
   * Calls /onboarding/register — returns userId, tenantId, subdomain (no JWT).
   * After this, we auto-login to get the token.
   */
  async signUp(signUpData: SignUpDto): Promise<{ userId: string; tenantId: string; subdomain: string }> {
    return apiClient.post("/onboarding/register", signUpData);
  }

  async login(credentials: LoginDto): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", credentials);
  }

  async forgotPassword(data: ForgotPassword): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/auth/forgot-password", data);
  }

  async resetPassword(data: ResetPassword): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/auth/reset-password", data);
  }

  async getProfile(): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>("/auth/profile");
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await apiClient.post("/auth/logout", { refreshToken });
    } catch (error) {
      console.warn("Server logout failed, proceeding with client-side cleanup.", error);
    }
  }
}

export const authService = new AuthService();