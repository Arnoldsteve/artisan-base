// This file defines the shapes of data sent to and received from your auth API.

/**
 * Data Transfer Object (DTO) for the login request.
 * This should match the expected body of your /v1/auth/login endpoint.
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Data Transfer Object (DTO) for the sign-up request.
 * This should match the expected body of your /v1/auth/signup endpoint.
 */
export interface SignUpDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Describes the successful response from the login endpoint.
 */
export interface LoginResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
  };
  organizations: {
    id: string;
    name: string;
    subdomain: string;
  }[];
}

/**
 * Describes the successful response from the sign-up endpoint.
 */
export interface SignUpResponse {
    message: string;
    accessToken: string;
    user: {
        id: string;
        email: string;
        firstName: string | null;
    };
}