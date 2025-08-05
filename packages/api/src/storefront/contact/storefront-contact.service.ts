import { Injectable, Scope } from '@nestjs/common';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { EmailService } from 'src/common/services/email.service';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontContactService {
  constructor(
    // Inject the new, centralized EmailService
    private readonly emailService: EmailService,
  ) {}

  /**
   * Handles the business logic for a contact form submission by sending an email.
   */
  async createSubmission(dto: CreateContactSubmissionDto): Promise<void> {
    return this.emailService.sendContactFormEmail(dto);
  }
}