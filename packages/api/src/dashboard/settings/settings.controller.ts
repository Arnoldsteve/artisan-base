import { Controller, Get, Patch, Body, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('dashboard/settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@Req() req: any) {
    // Assume req.tenant.id is set by middleware
    return this.settingsService.getSettings(req.tenant.id);
  }

  @Patch()
  async updateSettings(
    @Req() req: any,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.settingsService.updateSettings(req.tenant.id, updateSettingsDto);
  }
}
