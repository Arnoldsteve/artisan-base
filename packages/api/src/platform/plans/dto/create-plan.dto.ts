import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEnum,
  IsObject,
} from 'class-validator';
import { BillingCycle } from '@prisma/client/management'; 

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @IsObject()
  features: object;
}