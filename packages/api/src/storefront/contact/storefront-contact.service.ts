import { Injectable, Scope } from '@nestjs/common';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { EmailService } from '@/common/services/emails/email.service';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontContactService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  // storefront-contact.service.ts
async createSubmission(dto: CreateContactSubmissionDto): Promise<void> {
  await this.emailService.send({
    templateId: 'contact-form', // use your registered template ID
    props: {
      name: dto.name,
      email: dto.email,
      message: dto.message,
    },
    to: 'support@artisan-base.com', // or some default
  });
}

}