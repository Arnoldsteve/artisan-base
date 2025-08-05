import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsIn,
  Min,
  IsOptional,
  Matches,
} from 'class-validator';


export type PaymentMethod = 'stripe_card' | 'paypal' | 'mpesa'; 

export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(0.5)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsIn(['stripe_card', 'paypal', 'mpesa']) 
  @IsNotEmpty()
  method: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsOptional() 
  @IsString()
  @Matches(/^254\d{9}$/, { message: 'Phone number must be in the format 254xxxxxxxxx' })
  phoneNumber?: string;
}