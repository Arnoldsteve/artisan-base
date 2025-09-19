import { apiClient } from "@/lib/client-api";
import { LoginDto, SignUpDto, LoginResponse, SignUpResponse } from "@/types/auth";
import { ProfileResponse } from "@/types/users";

/**
 * AuthService directly handles API communication for dashboard authentication.
 */
export class AuthService {
  /**
   * Logs in a user.
   * On success, returns the full login response.
   * On failure, the apiClient will throw a structured ApiError.
   * @param credentials - The user's email and password.
   */
  async login(credentials: LoginDto): Promise<LoginResponse> {
    console.log("Logging in with credentials:", credentials);
    return apiClient.post<LoginResponse>("/auth/login", credentials);
  }

  /**
   * Signs up a new user.
   * The response for sign-up might be different, adjust if necessary.
   */
  async signUp(signUpData: SignUpDto): Promise<SignUpResponse> { 
    return apiClient.post<SignUpResponse>("/auth/signup", signUpData);
  }

  /**
   * Fetches the profile of the currently authenticated user.
   * Used to validate an existing session token.
   * The apiClient will automatically include the Authorization header.
   */
  async getProfile(): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>("/auth/profile");
  }

  /**
   * Logs out the user by calling the backend endpoint.
   * This is good practice for invalidating the session on the server.
   */
  async logout(): Promise<void> {
    // This is optional but recommended.
    // It calls a backend endpoint to invalidate the token.
    try {
        await apiClient.post("/auth/logout");
    } catch (error) {
        // Even if the backend call fails, we proceed with client-side logout.
        console.warn("Server logout failed, proceeding with client-side cleanup.", error);
    }
  }
}

// Export a singleton instance for use in hooks and components
export const authService = new AuthService();