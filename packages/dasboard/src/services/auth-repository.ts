import axios, { AxiosError } from "axios";
import {
  LoginDto,
  SignUpDto,
  SignUpResponse,
  LoginResponse,
} from "@/types/auth";

const bffApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export class AuthRepository {
  /**
   * Calls the BFF login endpoint.
   */
  static async login(credentials: LoginDto): Promise<LoginResponse> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed.");
      }
      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected network error occurred."
      );
    }
  }

  /**
   * Calls the BFF sign-up endpoint.
   */
  static async signUp(signUpData: SignUpDto): Promise<SignUpResponse> {
    try {
      const response = await bffApi.post<SignUpResponse>(
        "/auth/signup",
        signUpData
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message || "Sign-up failed.");
      }
      throw new Error("An unexpected network error occurred.");
    }
  }
}
// REFACTOR: Centralized all auth API calls for SRP, DRY, and testability.
