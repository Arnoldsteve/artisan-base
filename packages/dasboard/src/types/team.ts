// types/team.ts

// import { TenantRole } from "./roles"; // reuse your enum definitions
import { TenantRole } from "./roles";
import { Tenant } from "./tenant";

// A single team member inside a tenant organization
export interface TeamMember {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: TenantRole;         // must match your Prisma enum
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;        // ISO string
  updatedAt: string;        // ISO string
}

// Response shape for fetching all team members of a tenant
export interface TeamResponse {
  tenant: Tenant;
  members: TeamMember[];
}
