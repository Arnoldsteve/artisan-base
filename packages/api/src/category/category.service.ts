import {
  Injectable,
  NotFoundException,
  ConflictException,
  Options,
} from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';

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

  async findAll(options: PageOptionsDto) {
    return this.categoryRepo.list(options);
  }

  /**
   * PUBLIC ACTION: Find category by its SEO slug.
   * millions of users: Required for human-readable URLs and Marketplace discovery.
   */
  async findBySlug(slug: string) {
    const category = await this.categoryRepo.findBySlugIsolated(slug);

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found.`);
    }

    return category;
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
