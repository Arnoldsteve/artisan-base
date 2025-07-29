import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateContactSubmissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name must not exceed 100 characters.' })
  name: string;

  @IsEmail({}, { message: 'A valid email address is required.' })
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject cannot be empty.' })
  subject: string;

  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty.' })
  @MaxLength(5000, { message: 'Message must not exceed 5000 characters.' })
  message: string;
}