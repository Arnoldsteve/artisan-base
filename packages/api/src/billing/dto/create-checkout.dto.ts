import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

// For now, we only support Stripe, but this can be expanded.
enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  MPESA = 'MPESA',
}

export class CreateCheckoutDto {
  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  provider: PaymentProvider;
}