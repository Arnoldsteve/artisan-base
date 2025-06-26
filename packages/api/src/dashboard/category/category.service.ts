import { ConflictException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { TenantPrismaService } from 'src/prisma/tenant-prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import slugify from 'slugify';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable({ scope: Scope.REQUEST })
export class CategoryService {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = slugify(createCategoryDto.name, { lower: true, strict: true });

    const existing = await this.tenantPrisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`A category with the name '${createCategoryDto.name}' already exists.`);
    }

    return this.tenantPrisma.category.create({
      data: {
        ...createCategoryDto,
        slug,
      },
    });
  }

 async findAll() {
    return  this.tenantPrisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.tenantPrisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found.`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id); 

    const data: any = { ...updateCategoryDto };

    // If the name is being changed, we must regenerate the slug
    if (updateCategoryDto.name) {
      data.slug = slugify(updateCategoryDto.name, { lower: true, strict: true });
      
      // Check if the new slug conflicts with another category
      const existing = await this.tenantPrisma.category.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(`A category with the name '${updateCategoryDto.name}' already exists.`);
      }
    }

    return this.tenantPrisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); 
    
    // In your schema, onDelete: Cascade will handle cleaning up the join table later.
    // For now, this just deletes the category itself.
    return this.tenantPrisma.category.delete({ where: { id } });
  }
}