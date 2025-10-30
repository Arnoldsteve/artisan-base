import { DashboardUserRole } from './roles';
import { Tenant } from './tenant';

export interface User {
  avatarUrl: string | Blob;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: DashboardUserRole ; 
}


export interface ProfileResponse {
  user: User;
  organizations: Tenant[];
}

export type DashboardUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?:string;
  role: DashboardUserRole;
  isActive: boolean;
  createdAt: string;
};

export interface CreateDashboardUserDto {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string; 
  role: DashboardUserRole;
}

export interface UpdateDashboardUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string; 
  role?: DashboardUserRole;
}