import { TenantUserRole } from '@generated/prisma/client';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * SOLID Principle: Single Responsibility
 * This decorator attaches required Tenant Roles to a route handler.
 * Usage: @Roles(TenantUserRole.OWNER, TenantUserRole.ADMIN)
 */
export const Roles = (...roles: TenantUserRole[]) => SetMetadata(ROLES_KEY, roles);