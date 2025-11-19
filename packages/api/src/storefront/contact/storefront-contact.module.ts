import { Module, Scope } from '@nestjs/common';
import { StorefrontContactController } from './storefront-contact.controller';
import { StorefrontContactService } from './storefront-contact.service';
import { EmailModule } from '@/common/services/emails/email.module';

@Module({
  // Import the EmailModule to make EmailService available for dependency injection.
  imports: [EmailModule],
  controllers: [StorefrontContactController],
  providers: [
    // The only provider needed now is the service itself.
    // All repository and tenant context providers are removed.
    StorefrontContactService,
  ],
})
export class StorefrontContactModule {}