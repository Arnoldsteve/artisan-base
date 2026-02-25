import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class WebhookDto {
  @ApiProperty({
    description: 'Raw payload sent by the payment provider',
    type: Object,
  })
  @IsObject()
  @IsNotEmpty()
  payload: Record<string, any>;

  @ApiProperty({
    description: 'Signature header sent by provider for verification',
    required: false,
  })
  @IsOptional()
  @IsString()
  signature?: string;
}
