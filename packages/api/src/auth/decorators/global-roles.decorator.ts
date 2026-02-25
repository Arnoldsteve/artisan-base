import { SetMetadata } from '@nestjs/common';
import { GlobalRole } from '@generated/prisma/client';

export const GLOBAL_ROLES_KEY = 'globalRoles';

export const GlobalRoles = (...roles: GlobalRole[]) =>
  SetMetadata(GLOBAL_ROLES_KEY, roles);
