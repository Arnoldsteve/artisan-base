import { Request } from 'express';
import { Tenant } from 'generated/management'; // It's better to import the actual model type

// We can make this even more robust by using the Prisma-generated Tenant type
export interface RequestWithTenant extends Request {
  tenant: Tenant;
}