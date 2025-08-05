

import { Module, Scope } from '@nestjs/common';
import { StorefrontNewsletterService } from './storefront-newsletter.service';
import { StorefrontNewsletterController } from './storefront-newsletter.controller';
import { StorefrontNewsletterRepository } from './storefront-newsletter.repository';
// import { TenantPrismaModule } from 'src/prisma/tenant-prisma.module';
import { TenantContextService } from 'src/common/tenant-context.service';

@Module({
  imports: [],
  controllers: [StorefrontNewsletterController],
  providers: [
    StorefrontNewsletterService,
    {
      provide: 'StorefrontNewsletterRepository',
      useClass: StorefrontNewsletterRepository,
    },
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
})
export class StorefrontNewsletterModule {}
