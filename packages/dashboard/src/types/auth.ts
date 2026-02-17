import { User } from "./users";
import { Tenant } from "./tenant";

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

export interface LoginResponse {
  user: User;
  tenants: Tenant[];         // ← was organizations
  backend_tokens: {          // ← was flat accessToken/refreshToken
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignUpResponse {
  message: string;
  data: {
    userId: string;
    tenantId: string;
    subdomain: string;
  };
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  token: string;
  newPassword: string;
}