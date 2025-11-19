import { Injectable, Scope } from '@nestjs/common';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { EmailService } from '@/common/services/emails/email.service';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontContactService {
  constructor(private readonly emailService: EmailService) {}

  async createSubmission(
    dto: CreateContactSubmissionDto,
  ): Promise<{ success: boolean; message: string }> {
    const result = await this.emailService.send({
      templateId: 'contact-form',
      props: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
      },
      to: 'support@artisan-base.com',
    });

    // Transform email service result into API response
    if (result.success) {
      return {
        success: true,
        message: 'Your message has been submitted successfully.',
      };
    } else {
      return {
        success: false,
        message: `Failed to send email: ${result.error}`,
      };
    }
  }
}
