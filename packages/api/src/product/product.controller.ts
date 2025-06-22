import { Controller, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user, // <-- Use our decorator to get the full user object
  ) {
    const tenantId = user?.store?.id;

    // The controller is now responsible for ensuring a tenant exists
    if (!tenantId) {
      throw new UnauthorizedException('User is not affiliated with a store.');
    }

    // Pass the tenantId explicitly to the service
    return this.productService.create(tenantId, createProductDto);
  }
}