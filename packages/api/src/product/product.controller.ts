import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

// Note: In a real app, you would add a @UseGuards(DashboardAuthGuard) here
// to ensure only logged-in dashboard users can access these routes.

@Controller('v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body(ValidationPipe) createProductDto: CreateProductDto) {
    // The controller's only job is to delegate to the service.
    // It doesn't know or care about which tenant it is.
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }
}