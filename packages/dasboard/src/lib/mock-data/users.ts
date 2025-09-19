import { TenantRole } from "@/types/roles";
import { DashboardUserData } from "@/types/users";

// This type must match the one defined in your settings/page.tsx
// It's often better to move this type to a shared location too, e.g., src/types/users.ts


export const mockUsers: DashboardUserData[] = [
  { 
    id: 'user_1', 
    name: 'Arnold S.', 
    email: 'owner@artisanbase.com', 
    role: TenantRole.OWNER, 
    isActive: true, 
    createdAt: new Date('2023-01-15').toLocaleDateString() 
  },
  { 
    id: 'user_2', 
    name: 'Jane Admin', 
    email: 'jane.admin@example.com', 
    role: TenantRole.ADMIN, 
    isActive: true, 
    createdAt: new Date('2023-05-20').toLocaleDateString() 
  },
  { 
    id: 'user_3', 
    name: 'John Staff', 
    email: 'john.staff@example.com', 
    role: TenantRole.STAFF, 
    isActive: true, 
    createdAt: new Date('2024-02-10').toLocaleDateString() 
  },
  { 
    id: 'user_4', 
    name: 'Emily Inactive', 
    email: 'emily.inactive@example.com', 
    role: TenantRole.STAFF, 
    isActive: false, 
    createdAt: new Date('2023-11-30').toLocaleDateString() 
  },
];