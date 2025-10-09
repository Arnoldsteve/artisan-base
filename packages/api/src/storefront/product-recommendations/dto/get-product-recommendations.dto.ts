import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetProductRecommendationsDto {
  /**
   * The ID of the product to get recommendations for.
   * Must be a non-empty string, preferably a UUID.
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @IsString()
  @IsNotEmpty()
  // @IsUUID('4', { message: 'Product ID must be a valid UUID version 4.' }) // <-- Best practice!
  id: string;
}