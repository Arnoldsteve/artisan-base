import { Module, Scope } from '@nestjs/common';
import { StorefrontContactController } from './storefront-contact.controller';
import { StorefrontContactService } from './storefront-contact.service';
import { EmailModule } from '@/common/services/emails/email.module';

@Module({
  imports: [EmailModule],
  controllers: [StorefrontContactController],
  providers: [
    StorefrontContactService,
  ],
})
export class StorefrontContactModule {}