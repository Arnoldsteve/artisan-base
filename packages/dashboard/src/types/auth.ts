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
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
  organizations: Tenant[];
}

export interface SignUpResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  token : string,
  newPassword: string
}
