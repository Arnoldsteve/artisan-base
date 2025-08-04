import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsIn,
  Min,
  IsOptional,
  Matches, // Import the Matches decorator for phone number validation
} from 'class-validator';

// Define the allowed payment methods as a type for better type safety
export type PaymentMethod = 'stripe_card' | 'paypal' | 'mpesa'; // <-- Add 'mpesa'

export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(0.5)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  // --- 1. UPDATE THE ALLOWED METHODS ---
  @IsIn(['stripe_card', 'paypal', 'mpesa']) // <-- Add 'mpesa'
  @IsNotEmpty()
  method: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  // --- 2. ADD THE PHONE NUMBER FIELD (only for M-Pesa) ---
  /**
   * The user's Safaricom phone number in the format 254...
   * Required only when the method is 'mpesa'.
   */
  @IsOptional() // Make it optional since it's not needed for Stripe/PayPal
  @IsString()
  @Matches(/^254\d{9}$/, { message: 'Phone number must be in the format 254xxxxxxxxx' })
  phoneNumber?: string;
}