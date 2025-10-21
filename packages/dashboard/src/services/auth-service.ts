import { apiClient } from "@/lib/client-api";
import { LoginDto, SignUpDto, LoginResponse, SignUpResponse } from "@/types/auth";
import { ProfileResponse } from "@/types/users";

/**
 */
export class AuthService {
 
  async login(credentials: LoginDto): Promise<LoginResponse> {
    console.log("Logging in with credentials:", credentials);
    return apiClient.post<LoginResponse>("/auth/login", credentials);
  }


  async signUp(signUpData: SignUpDto): Promise<SignUpResponse> { 
    return apiClient.post<SignUpResponse>("/auth/signup", signUpData);
  }

  
  async getProfile(): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>("/auth/profile");
  }

 
  async logout(): Promise<void> {
    try {
        await apiClient.post("/auth/logout");
    } catch (error) {
        console.warn("Server logout failed, proceeding with client-side cleanup.", error);
    }
  }
}

export const authService = new AuthService();