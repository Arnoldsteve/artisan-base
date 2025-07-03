export interface ITenantRepository {
  findUserById(id: string): Promise<any | null>;
  findTenantBySubdomain(subdomain: string): Promise<any | null>;
  createTenant(data: any): Promise<any>;
  deleteTenantById(id: string): Promise<void>;
  executeRaw(sql: string): Promise<any>;
  readTenantMigrationSql(): Promise<string>;

  getSettings(tenantId: string): Promise<any>;
  updateSettings(tenantId: string, settings: any): Promise<any>;
}
