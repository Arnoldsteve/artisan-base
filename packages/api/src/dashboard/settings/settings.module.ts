import { Module, Scope } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SettingsRepository } from './settings.repository';
import { ISettingsRepository } from './interfaces/settings-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SettingsController],
  providers: [
    {
      provide: SettingsService,
      useClass: SettingsService,
      scope: Scope.REQUEST,
    },
    PrismaService,
    {
      provide: ISettingsRepository,
      useClass: SettingsRepository,
    },
  ],
})
export class SettingsModule {}
