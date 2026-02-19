import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PlanRepository } from './repositories/plan.repository';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);

  constructor(private readonly planRepo: PlanRepository) {}

  async create(dto: CreatePlanDto) {
    const plan = await this.planRepo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      billingCycle: dto.billingCycle,
      features: dto.features ?? {},
      stripePriceId: dto.stripePriceId,
    });

    this.logger.log(`Plan created | ${plan.name} | $${plan.price}`);
    return plan;
  }

  async findAll() {
    return this.planRepo.findAll();
  }

  async findById(id: string) {
    const plan = await this.planRepo.findById(id);
    if (!plan) throw new NotFoundException(`Plan ${id} not found`);
    return plan;
  }

  async update(id: string, dto: UpdatePlanDto) {
    await this.findById(id); // Ensure exists

    const plan = await this.planRepo.update(id, {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      billingCycle: dto.billingCycle,
      features: dto.features,
      stripePriceId: dto.stripePriceId,
      isActive: dto.isActive,
    });

    this.logger.log(`Plan updated | ${plan.name}`);
    return plan;
  }

  async delete(id: string) {
    // Prevent deleting a plan that has active tenants
    const tenantCount = await this.planRepo.countTenants(id);
    if (tenantCount > 0) {
      throw new BadRequestException(
        `Cannot delete plan — ${tenantCount} tenant(s) are currently on this plan`,
      );
    }

    await this.planRepo.softDelete(id);
    this.logger.log(`Plan soft-deleted | ${id}`);
    return { success: true };
  }
}