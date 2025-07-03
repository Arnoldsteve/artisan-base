export interface ISettingsRepository {
  getSettings(tenantId: string): Promise<any>;
  updateSettings(tenantId: string, settings: any): Promise<any>;
}

export const ISettingsRepository = Symbol('ISettingsRepository');
