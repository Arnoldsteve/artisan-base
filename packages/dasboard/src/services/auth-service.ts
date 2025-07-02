import { AuthRepository } from "./auth-repository";
import { LoginDto, SignUpDto } from "@/types/auth";

export class AuthService {
  /**
   * Handles login business logic, returns result and error.
   */
  static async login(credentials: LoginDto) {
    try {
      const data = await AuthRepository.login(credentials);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * Handles signup business logic, returns result and error.
   */
  static async signUp(signUpData: SignUpDto) {
    try {
      const data = await AuthRepository.signUp(signUpData);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }
}
// REFACTOR: Business logic separated from UI for SRP, testability, and DRY.
