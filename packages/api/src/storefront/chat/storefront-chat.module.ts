import { Module } from '@nestjs/common';
import { StorefrontChatGateway } from './storefront-chat.gateway';

@Module({
  providers: [StorefrontChatGateway],
})
export class StorefrontChatModule {} 