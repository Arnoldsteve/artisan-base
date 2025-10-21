import { TenantRole } from './roles';
import { Tenant } from './tenant';

export interface User {
  avatarUrl: string | Blob;
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role?: TenantRole ; 
}


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