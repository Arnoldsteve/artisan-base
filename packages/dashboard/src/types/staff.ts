import { TenantUserRole } from './roles';

export interface StaffMember {
  id: string;      
  tenantId: string;
  userId: string;
  role: TenantUserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    avatarUrl?: string | null | Blob; 
    email: string;
  };
}

export interface CreateStaffDto {
  email: string;
  firstName?: string;
  lastName?: string;
  role: TenantUserRole;
}

export interface UpdateStaffRoleDto {
  role: TenantUserRole;
}
