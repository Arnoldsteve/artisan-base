import { apiClient } from './client'; 
import { LoginDto, SignUpDto, LoginResponse, SignUpResponse } from '@/types/auth';
import { AxiosError } from 'axios';

/**
 * Handles the user login request using axios.
 * @param credentials - The user's email and password.
 * @returns The login response data including the access token.
 * @throws An error if the login fails.
 */
export async function login(credentials: LoginDto): Promise<LoginResponse> {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || 'Login failed. Please try again.');
    }
    throw new Error('An unexpected error occurred during login.');
  }
}

/**
 * Handles the user sign-up request using axios.
 * @param signUpData - The user's details for creating a new account.
 * @returns The sign-up response data.
 * @throws An error if sign-up fails (e.g., email already in use).
 */
export async function signUp(signUpData: SignUpDto): Promise<SignUpResponse> {
  try {
    const response = await apiClient.post('/auth/signup', signUpData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || 'Sign-up failed. Please try again.');
    }
    throw new Error('An unexpected error occurred during sign-up.');
  }
}