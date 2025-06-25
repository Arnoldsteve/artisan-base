// In packages/api/src/storage/storage.controller.ts
import { Controller, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StorageService } from './storage.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('storage')
@UseGuards(AuthGuard('jwt'))
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  async getSignedUrl(
    @GetUser() user,
    @Body() body: { fileName: string; fileType: string },
  ) {
    const tenantId = user?.store?.id;
    if (!tenantId) {
      throw new UnauthorizedException('User is not affiliated with a store.');
    }

    const path = `${tenantId}/${Date.now()}-${body.fileName}`;
    return this.storageService.createSignedUploadUrl(path);
  }
}