import { apiClient } from "@/lib/client-api";
import {
  LoginDto,
  SignUpDto,
  LoginResponse,
  SignUpResponse,
  ForgotPassword,
  ResetPassword,
} from "@/types/auth";
import { ProfileResponse } from "@/types/users";

export class AuthService {
  async signUp(signUpData: SignUpDto): Promise<SignUpResponse> {
    return apiClient.post<SignUpResponse>("/auth/signup", signUpData);
  }

  async login(credentials: LoginDto): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", credentials);
  }

  async forgotPassword(data: ForgotPassword): Promise<{ message: string }> {
    console.log("User account email", data);
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
      console.warn(
        "Server logout failed, proceeding with client-side cleanup.",
        error
      );
    }
  }
  
}

export const authService = new AuthService();
