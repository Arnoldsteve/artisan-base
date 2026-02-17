import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly tenantContext: TenantContextService,
  ) {}

  async create(dto: CreateCategoryDto) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    // Slug must be unique per tenant
    const slugExists = await this.categoryRepo.findBySlug(dto.slug, tenantId);
    if (slugExists) {
      throw new ConflictException('Category slug already exists');
    }

    return this.categoryRepo.create({
      tenantId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      // isActive: dto.isActive ?? true,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.categoryRepo.list({
        tenantId,
        skip,
        take: limit,
      }),
      this.categoryRepo.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const tenantId = this.tenantContext.getTenantIdOrThrow();

    const category = await this.categoryRepo.findById(id, tenantId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id); 
    return this.categoryRepo.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id); 
    return this.categoryRepo.delete(id);
  }
}
