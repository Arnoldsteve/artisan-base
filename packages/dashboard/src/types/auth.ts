// File: packages/dasboard/src/types/auth.ts

import { User } from './users'; // <-- IMPORT THE MAIN USER TYPE
import { Tenant } from './tenant'; // <-- IMPORT THE MAIN TENANT TYPE

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Describes the successful response from the login endpoint.
 * This now uses our central User and Tenant types for consistency.
 */
export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User; // <-- THIS IS THE FIX. Use the main User type.
  organizations: Tenant[]; // <-- THIS IS THE FIX. Use the main Tenant type.
}

/**
 * Describes the successful response from the sign-up endpoint.
 */
export interface SignUpResponse {
  message: string;
  accessToken: string;
  user: User; // <-- Use the main User type here too for consistency.
}