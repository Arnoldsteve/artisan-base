// src/types/user.ts
import { TenantRole } from './roles';
import { Tenant } from './tenant';


/**
 * Defines the shape of the main User object, as returned by the API.
 * This should match the user object within your LoginResponse and ProfileResponse.
 */
export interface User {
  avatarUrl: string | Blob;
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role?: TenantRole ; // 🔑 add role here
}

/**
 * Describes the successful response from the /auth/profile endpoint.
 * This is used to validate an existing session.
 */
export interface ProfileResponse {
  user: User;
  organizations: Tenant[];
}

export type DashboardUserData = {
  id: string;
  name: string | null;
  email: string;
  role: TenantRole;
  isActive: boolean;
  createdAt: string;
};