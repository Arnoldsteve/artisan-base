export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  firstName: string;
  lastName: string;
  phone?: string;
} 