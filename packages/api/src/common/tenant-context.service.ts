import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  tenantId: string;
  userId: string;
  // Add more fields as needed

  setContext(tenantId: string, userId: string) {
    this.tenantId = tenantId;
    this.userId = userId;
  }
}
