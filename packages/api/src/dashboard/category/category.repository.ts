import {
  Injectable,
  ConflictException,
  NotFoundException,
  Scope,
  OnModuleInit,
} from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ICategoryRepository } from './interfaces/category-repository.interface';
import slugify from 'slugify';
import { PrismaClient } from '../../../generated/tenant'; // Import the actual PrismaClient type

// Make the repository request-scoped to ensure it uses the correct tenant client
@Injectable({ scope: Scope.REQUEST })
export class CategoryRepository implements ICategoryRepository, OnModuleInit {
  // This property will hold the ready-to-use client for this request.
  private prisma: PrismaClient;

  // Inject our standard gateway to the prisma client factory
  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  /**
   * This hook runs once per request, fetching the correct Prisma client for the
   * tenant and assigning it to the local `this.prisma` property.
   */
  async onModuleInit() {
    this.prisma = await this.tenantPrismaService.getClient();
  }

  // --- ALL LOGIC BELOW REMAINS UNCHANGED ---
  // It will now use the `this.prisma` property that was correctly initialized.

  async create(dto: CreateCategoryDto): Promise<any> {
    const slug = slugify(dto.name, { lower: true, strict: true });
    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(
        `A category with the name '${dto.name}' already exists.`,
      );
    }
    const category = await this.prisma.category.create({
      data: { ...dto, slug },
    });
    return category;
  }

  async findAll(pagination?: PaginationQueryDto): Promise<any> {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<any> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found.`);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<any> {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.name) {
      data.slug = slugify(dto.name, { lower: true, strict: true });
      const existing = await this.prisma.category.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(
          `A category with the name '${dto.name}' already exists.`,
        );
      }
    }
    const category = await this.prisma.category.update({
      where: { id },
      data,
    });
    return category;
  }

  async remove(id: string): Promise<any> {
    await this.findOne(id);
    const category = await this.prisma.category.delete({ where: { id } });
    return category;
  }
}