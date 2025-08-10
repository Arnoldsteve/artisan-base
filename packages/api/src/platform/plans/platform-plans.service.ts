import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException, // Import NotFoundException
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto'; // Import UpdatePlanDto
import { SubscriptionPlan } from '@prisma/client/management';
import {
  IPlatformPlansRepository,
  PLATFORM_PLANS_REPOSITORY,
} from './interfaces/platform-plans-repository.interface';

@Injectable()
export class PlatformPlansService {
  constructor(
    @Inject(PLATFORM_PLANS_REPOSITORY)
    private readonly repository: IPlatformPlansRepository,
  ) {}

  async createPlan(createPlanDto: CreatePlanDto): Promise<SubscriptionPlan> {
    const existingPlan = await this.repository.findByName(createPlanDto.name);
    if (existingPlan) {
      throw new ConflictException(
        `A subscription plan with the name '${createPlanDto.name}' already exists.`,
      );
    }
    return this.repository.create(createPlanDto);
  }

  
  async findAllPlans(): Promise<SubscriptionPlan[]> {
    return this.repository.findAll();
  }

  async findPlanById(id: string): Promise<SubscriptionPlan> {
    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new NotFoundException(`Subscription plan with ID '${id}' not found.`);
    }
    return plan;
  }

  async updatePlan(
    id: string,
    updatePlanDto: UpdatePlanDto,
  ): Promise<SubscriptionPlan> {
    await this.findPlanById(id);
    return this.repository.update(id, updatePlanDto);
  }

  
  async deletePlan(id: string): Promise<void> {
    await this.findPlanById(id);
    return this.repository.delete(id);
  }
}