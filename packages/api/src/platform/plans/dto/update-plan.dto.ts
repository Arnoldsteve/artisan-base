import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';

/**
 * Defines the data structure for updating an existing subscription plan.
 * It extends the CreatePlanDto, making all properties optional.
 * This allows a platform admin to update one or more fields of a plan at once.
 */
export class UpdatePlanDto extends PartialType(CreatePlanDto) {}