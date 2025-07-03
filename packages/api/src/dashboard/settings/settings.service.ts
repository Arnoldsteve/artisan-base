import { Injectable, Inject, Scope } from '@nestjs/common';
import { ISettingsRepository } from './interfaces/settings-repository.interface';

@Injectable({ scope: Scope.REQUEST })
export class SettingsService {
  constructor(
    @Inject(ISettingsRepository)
    private readonly settingsRepository: ISettingsRepository,
  ) {}

  getSettings(tenantId: string) {
    return this.settingsRepository.getSettings(tenantId);
  }

  updateSettings(tenantId: string, settings: any) {
    return this.settingsRepository.updateSettings(tenantId, settings);
  }
}
