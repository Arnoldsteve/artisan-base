import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailTemplateRegistry } from './templates/registry';
import { EmailRenderer } from './utils/email-renderer';
import { ResendEmailProvider } from './providers/resend.provider';
import { EMAIL_PROVIDER } from './constants';

// Import all email templates
import { 
  contactFormEmailTemplate,
  orderConfirmationEmailTemplate,
} from './templates';

@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    EmailTemplateRegistry,
    EmailRenderer,
    {
      provide: EMAIL_PROVIDER,
      useClass: ResendEmailProvider,
    },
  ],
  exports: [EmailService, EMAIL_PROVIDER],
})
export class EmailModule implements OnModuleInit {
  constructor(private readonly registry: EmailTemplateRegistry) {}

  onModuleInit() {
    // Register all templates on module initialization
    this.registry.register(contactFormEmailTemplate);
    this.registry.register(orderConfirmationEmailTemplate);
  }
}
