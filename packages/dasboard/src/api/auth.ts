// src/api/auth.ts
import axios, { AxiosError } from "axios";

import { LoginDto, SignUpDto, SignUpResponse } from "@/types/auth";

const bffApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface LoginBffResponse {
  success: boolean;
  hasOrganizations: boolean;
}

/**
 * Calls our internal BFF login endpoint (/api/auth/login) using axios.
 * This is designed to be called from the LoginForm component.
 */
export async function login(credentials: LoginDto): Promise<LoginBffResponse> {
  try {
    const response = await bffApi.post<LoginBffResponse>(
      "/auth/login",
      credentials
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || "Login failed.");
    }

    throw new Error("An unexpected network error occurred.");
  }
}

/**
 * Calls our internal BFF sign-up endpoint (/api/auth/signup).
 * (This function remains unchanged)
 */
export async function signUp(signUpData: SignUpDto): Promise<SignUpResponse> {
  console.log("Sign-up data:", signUpData);
  try {
    const response = await bffApi.post<SignUpResponse>(
      "/auth/signup",
      signUpData
    );
    console.log("Sign-up response:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || "Sign-up failed.");
    }
    throw new Error("An unexpected network error occurred.");
  }
}
