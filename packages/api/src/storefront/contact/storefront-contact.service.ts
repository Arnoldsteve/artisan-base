import { Injectable, Scope } from '@nestjs/common';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { EmailService } from '@/common/services/emails/email.service';
import { EmailTemplateId } from '@/common/services/emails/templates';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontContactService {
  constructor(private readonly emailService: EmailService) {}
  
  async createSubmission(dto: CreateContactSubmissionDto) {
    return this.emailService.send({
      templateId: EmailTemplateId.CONTACT_FORM,
      props: dto,
    });
  }
}
