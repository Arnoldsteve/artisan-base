import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  IEmailProvider,
  EmailSendOptions,
  EmailSendResult,
} from './email-provider.interface';

@Injectable()
export class ResendEmailProvider implements IEmailProvider {
  private readonly logger = new Logger(ResendEmailProvider.name);
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    this.resend = new Resend(apiKey);
  }

  async send(options: EmailSendOptions): Promise<EmailSendResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
      });

      if (error) {
        this.logger.error(`Failed to send email: ${error.message}`, error);
        return {
          success: false,
          error: error.message,
        };
      }

      this.logger.log(`Email sent successfully. ID: ${data?.id}`);
      return {
        success: true,
        messageId: data?.id,
      };
    } catch (error) {
      this.logger.error('Unexpected error sending email', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  async sendBatch(options: EmailSendOptions[]): Promise<EmailSendResult[]> {
    // Resend supports batch sending
    const results = await Promise.all(options.map((opt) => this.send(opt)));
    return results;
  }
}