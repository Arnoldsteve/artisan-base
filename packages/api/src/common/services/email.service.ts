import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { Resend } from 'resend';
import { ContactFormEmail } from 'src/emails/storefont/ContactFormEmail';
import { CreateContactSubmissionDto } from 'src/storefront/contact/dto/create-contact-submission.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendContactFormEmail(data: CreateContactSubmissionDto): Promise<void> {
    const recipient = this.configService.get<string>('CONTACT_FORM_RECIPIENT');
    Logger.log(`Sending contact form email to: ${recipient}`);

    if (!recipient) {
      this.logger.error(
        'CONTACT_FORM_RECIPIENT is not configured in environment variables.',
      );
      throw new InternalServerErrorException(
        'The server is not configured to handle contact form submissions.',
      );
    }
     const html = await render(ContactFormEmail({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    }));

    try {
      await this.resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: recipient, 
        subject: `New Contact Form Submission: ${data.subject}`,
        replyTo: data.email, 
        html,
      });
      this.logger.log(`Contact form email sent successfully to ${recipient}`);
    } catch (error) {
      this.logger.error('Failed to send contact form email via Resend', error);
      // Re-throw the error so the controller's exception filter can catch it.
      throw new InternalServerErrorException('Failed to send message.');
    }
  }
}