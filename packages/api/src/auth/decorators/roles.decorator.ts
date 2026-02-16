import { SetMetadata } from '@nestjs/common';
import { TenantUserRole } from '@generated/prisma/client';

/**
 * SOLID Principle: Open/Closed
 * This decorator allows us to extend the behavior of endpoints 
 * without modifying the actual business logic of the controller.
 */
export const ROLES_KEY = 'roles';

/**
 * Custom decorator to restrict access based on Tenant-specific roles.
 * Usage: @Roles('OWNER', 'ADMIN')
 */
export const Roles = (...roles: TenantUserRole[]) => SetMetadata(ROLES_KEY, roles);