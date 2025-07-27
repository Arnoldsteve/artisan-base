// dto/newsletter-subscription.dto.ts
import { IsEmail, IsOptional, IsString, IsBoolean } from "class-validator";

export class NewsletterSubscriptionDto {
  @IsEmail({}, { message: "Please enter a valid email address." })
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsBoolean()
  consentToMarketing?: boolean;
}
