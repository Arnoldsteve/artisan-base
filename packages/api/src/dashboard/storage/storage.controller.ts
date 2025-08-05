import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Scope,
  ValidationPipe,
  Body,
  HttpCode,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  DeleteImageParamsDto,
  FinalizeUploadBodyDto,
  GetUploadUrlDto,
} from './dto/storage.dto';

@Controller({
  path: 'dashboard/storage',
  scope: Scope.REQUEST,
})
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  /**
   * Endpoint for the client to request a secure upload URL.
   */
  @Post('upload-url')
  getSignedUploadUrl(@Body(ValidationPipe) body: GetUploadUrlDto) {
    return this.storageService.createSignedUploadUrl(
      body.productId,
      body.fileName,
      body.fileType,
    );
  }

  /**
   * Endpoint for the client to call AFTER a successful direct upload.
   */
  @Post('finalize-upload')
  @HttpCode(200)
  finalizeUpload(@Body(ValidationPipe) body: FinalizeUploadBodyDto) {
    return this.storageService.finalizeUpload(
      body.productId,
      body.fileId,
      body.path,
    );
  }

  /**
   * Endpoint to delete an image record and the file from storage.
   */
  @Delete('products/:productId/images/:imageId')
  deleteImage(@Param(ValidationPipe) params: DeleteImageParamsDto) {
    return this.storageService.deleteImage(params.productId, params.imageId);
  }
}