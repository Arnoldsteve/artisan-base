import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailTemplateRegistry } from './templates/registry';
import { EmailRenderer } from './utils/email-renderer';
import { ResendEmailProvider } from './providers/resend.provider';
import { EMAIL_PROVIDER } from './constants';
import { contactFormEmailTemplate } from './templates';

@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    EmailTemplateRegistry,
    EmailRenderer,
    {
      provide: EMAIL_PROVIDER, // runtime token
      useClass: ResendEmailProvider,
    },
    // Template registration provider
    {
      provide: 'REGISTER_EMAIL_TEMPLATES',
      useFactory: (registry: EmailTemplateRegistry) => {
        registry.register(contactFormEmailTemplate);
      },
      inject: [EmailTemplateRegistry],
    },
  ],
  exports: [EmailService, EMAIL_PROVIDER],
})
export class EmailModule {}
