import { apiClient } from "@/lib/api-client";
import type { AuthCredentials, SignupData } from "@/types/auth-types";

export async function login(credentials: AuthCredentials): Promise<any> {
  console.log("Logging in with credentials:", credentials);
  return apiClient.post<any>("/api/v1/storefront/auth/login", credentials);
}

export async function signup(data: SignupData): Promise<any> {
  return apiClient.post<any>("/api/v1/storefront/auth/register", data);
}
