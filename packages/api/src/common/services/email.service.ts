import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
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

    try {
      await this.resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: recipient, 
        subject: `New Contact Form Submission: ${data.subject}`,
        replyTo: data.email, 
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* Basic styles */
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; }
              .wrapper { background-color: #f2f2f7; padding: 20px; }
              .container { background-color: #ffffff; border: 1px solid #e5e5ea; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .header img { max-width: 150px; }
              .content h1 { font-size: 24px; color: #1c1c1e; margin-top: 0; }
              .content p { color: #3c3c43; line-height: 1.5; }
              .info-box { background-color: #f2f2f7; border-radius: 6px; padding: 20px; margin: 20px 0; }
              .info-box strong { display: block; margin-bottom: 4px; color: #6c6c70; font-size: 14px; }
              .message-box { border-top: 1px solid #e5e5ea; padding-top: 20px; margin-top: 20px; }
              .cta-button { display: block; width: fit-content; margin: 30px auto 0; padding: 12px 25px; background-color: #007aff; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #8e8e93; }
            </style>
          </head>
          <body style="margin: 0; padding: 0;">
            <div class="wrapper" style="background-color: #f2f2f7; padding: 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div class="container" style="background-color: #ffffff; border: 1px solid #e5e5ea; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 40px;">
                      <div class="header" style="text-align: center; margin-bottom: 30px;">
                        <!-- Optional: Add your logo here -->
                        <!-- <img src="YOUR_LOGO_URL" alt="Artisan-Base Logo"> -->
                        <h1 style="font-size: 28px; color: #1c1c1e; margin-top: 0;">New Contact Submission</h1>
                      </div>

                      <div class="content">
                        <p style="color: #3c3c43; line-height: 1.5;">You have received a new message from your website's contact form.</p>

                        <div class="info-box" style="background-color: #f2f2f7; border-radius: 6px; padding: 20px; margin: 20px 0;">
                          <p style="margin: 0 0 15px 0;">
                            <strong style="display: block; margin-bottom: 4px; color: #6c6c70; font-size: 14px;">Sender's Name:</strong>
                            <span style="font-size: 16px; color: #1c1c1e;">${data.name}</span>
                          </p>
                          <p style="margin: 0;">
                            <strong style="display: block; margin-bottom: 4px; color: #6c6c70; font-size: 14px;">Sender's Email:</strong>
                            <span style="font-size: 16px; color: #1c1c1e;">${data.email}</span>
                          </p>
                        </div>

                        <div class="message-box" style="border-top: 1px solid #e5e5ea; padding-top: 20px; margin-top: 20px;">
                          <h2 style="font-size: 20px; color: #1c1c1e; margin-bottom: 15px;">Subject: ${data.subject}</h2>
                          <p style="color: #3c3c43; line-height: 1.5;">${data.message.replace(/\n/g, '<br>')}</p>
                        </div>

                        <!-- Action Button -->
                        <a href="mailto:${data.email}" class="cta-button" style="display: block; width: fit-content; margin: 30px auto 0; padding: 12px 25px; background-color: #007aff; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold;">
                          Reply to ${data.name}
                        </a>
                      </div>

                      <div class="footer" style="text-align: center; margin-top: 30px; font-size: 12px; color: #8e8e93;">
                        This email was sent from the Artisan-Base contact form.
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </body>
          </html>
        `,
      });
      this.logger.log(`Contact form email sent successfully to ${recipient}`);
    } catch (error) {
      this.logger.error('Failed to send contact form email via Resend', error);
      // Re-throw the error so the controller's exception filter can catch it.
      throw new InternalServerErrorException('Failed to send message.');
    }
  }
}