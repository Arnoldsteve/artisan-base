import { Injectable, Scope } from '@nestjs/common';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { EmailService } from '@/common/services/emails/email.service';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontContactService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  async createSubmission(dto: CreateContactSubmissionDto): Promise<void> {
    return this.emailService.sendContactFormEmail(dto);
  }
}