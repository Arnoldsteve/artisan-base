import { DashboardUserRole } from './roles';
import { Tenant } from './tenant';

export interface User {
  avatarUrl: string | Blob;
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role?: DashboardUserRole ; 
}


export interface ProfileResponse {
  user: User;
  organizations: Tenant[];
}

export type DashboardUserData = {
  id: string;
  name: string | null;
  email: string;
  password?:string;
  role: DashboardUserRole;
  isActive: boolean;
  createdAt: string;
};