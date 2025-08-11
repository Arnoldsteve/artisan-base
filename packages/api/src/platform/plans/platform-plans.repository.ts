import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { SubscriptionPlan } from '@prisma/client/management';
import { IPlatformPlansRepository } from './interfaces/platform-plans-repository.interface';

@Injectable()
export class PlatformPlansRepository implements IPlatformPlansRepository {
  constructor(private prisma: PrismaService) {}

  private get db() {
    return this.prisma;
  }

  async create(dto: CreatePlanDto): Promise<SubscriptionPlan> {
    return this.db.subscriptionPlan.create({
      data: dto,
    });
  }

  async findByName(name: string): Promise<SubscriptionPlan | null> {
    return this.db.subscriptionPlan.findFirst({
      where: { name },
    });
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    return this.db.subscriptionPlan.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    return this.db.subscriptionPlan.findMany({
      orderBy: {
        price: 'asc',
      },
    });
  }

  async update(id: string, dto: UpdatePlanDto): Promise<SubscriptionPlan> {
    return this.db.subscriptionPlan.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.subscriptionPlan.delete({
      where: { id },
    });
  }
}