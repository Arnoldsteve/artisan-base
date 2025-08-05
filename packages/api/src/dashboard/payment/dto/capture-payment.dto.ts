import { IsNotEmpty, IsString } from 'class-validator';

/**
 * This DTO validates the data sent from the frontend to capture a PayPal payment.
 */
export class CapturePayPalOrderDto {
  /**
   * The unique order ID (or 'token') from PayPal's redirect URL.
   * Example: "9E979451C2767544C"
   */
  @IsString()
  @IsNotEmpty()
  paypalOrderId: string;
}