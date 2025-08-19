import { SubscriptionPlan } from '../../../../generated/management';
import { CreatePlanDto } from '../dto/create-plan.dto';
import { UpdatePlanDto } from '../dto/update-plan.dto';

// Define a token for dependency injection
export const PLATFORM_PLANS_REPOSITORY = 'IPlatformPlansRepository';

export interface IPlatformPlansRepository {
  /**
   * Creates a new subscription plan in the database.
   * @param dto The data needed to create the plan.
   */
  create(dto: CreatePlanDto): Promise<SubscriptionPlan>;

  /**
   * Finds a subscription plan by its unique name.
   * @param name The name of the plan.
   */
  findByName(name: string): Promise<SubscriptionPlan | null>;

  /**
   * Retrieves a single subscription plan by its unique ID.
   * @param id The CUID of the plan.
   */
  findById(id: string): Promise<SubscriptionPlan | null>;

  /**
   * Retrieves a list of all available subscription plans.
   */
  findAll(): Promise<SubscriptionPlan[]>;

  /**
   * Updates an existing subscription plan.
   * @param id The CUID of the plan to update.
   * @param dto The data to update.
   */
  update(id: string, dto: UpdatePlanDto): Promise<SubscriptionPlan>;

  /**
   * Deletes a subscription plan from the database.
   * @param id The CUID of the plan to delete.
   */
  delete(id: string): Promise<void>;
}