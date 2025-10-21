import { TenantRole } from "./roles";
import { Tenant } from "./tenant";

export interface TeamMember {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: TenantRole;         
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;       
  updatedAt: string;       
}

export interface TeamResponse {
  tenant: Tenant;
  members: TeamMember[];
}
