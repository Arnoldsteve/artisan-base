import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Scope,
  ValidationPipe,
} from '@nestjs/common';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { StorefrontContactService } from './storefront-contact.service';

@Controller({
  path: 'storefront/contact',
  scope: Scope.REQUEST,
})
export class StorefrontContactController {
  constructor(private readonly contactService: StorefrontContactService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(
    @Body(new ValidationPipe()) dto: CreateContactSubmissionDto,
  ): Promise<void> {
    Logger.log( `Received contact submission: ${JSON.stringify(dto)}`);
    return this.contactService.createSubmission(dto);
  }
}
