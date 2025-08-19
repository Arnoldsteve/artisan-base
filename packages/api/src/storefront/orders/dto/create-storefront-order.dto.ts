import { Currency } from '../../../../generated/tenant';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPositive,
  IsString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
export class CreateStorefrontOrderDto {
  customer?: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  shippingAddress: Record<string, any>;
  billingAddress: Record<string, any>;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;

  @IsEnum(Currency) 
  currency: Currency; 
  
  notes?: string;
}
