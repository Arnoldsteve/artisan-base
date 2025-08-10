import {
  Injectable,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { SubscriptionPlan } from '@prisma/client/management';
import { IPlatformPlansRepository, PLATFORM_PLANS_REPOSITORY } from './interfaces/platform-plans-repository.interface';

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
}