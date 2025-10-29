import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Scope,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { AssignProductDto } from './dto/assign-product.dto';
import { ProductCategoryService } from '../product-category/product-category.service';

@Controller({
  path: 'dashboard/categories',
  scope: Scope.REQUEST,
})
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Post(':id/assign-product')
  assignProduct(
    @Param('id') id: string,
    @Body(ValidationPipe) body: AssignProductDto,
  ) {
    // id is categoryId, body.productId is product
    return this.productCategoryService.assignProductToCategory(
      body.productId,
      id,
    );
  }

  @Post(':id/unassign-product')
  unassignProduct(
    @Param('id') id: string,
    @Body(ValidationPipe) body: AssignProductDto,
  ) {
    return this.productCategoryService.unassignProductFromCategory(
      body.productId,
      id,
    );
  }
}
