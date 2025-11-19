import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailTemplateRegistry } from './templates/registry';
import { EmailRenderer } from './utils/email-renderer';
import { ResendEmailProvider } from './providers/resend.provider';
import { EMAIL_PROVIDER } from './constants';

@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    EmailTemplateRegistry,
    EmailRenderer,
    {
      provide: EMAIL_PROVIDER, // runtime token
      useClass: ResendEmailProvider, // any provider implementing IEmailProvider
    },
  ],
  exports: [EmailService, EMAIL_PROVIDER],
})
export class EmailModule {}
