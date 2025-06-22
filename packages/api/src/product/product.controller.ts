import { Controller, Post, Body, UseGuards, UnauthorizedException, Get, Param, Patch } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { UpdateProductDto } from './dto/create-product.dto';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body() createProductDto: UpdateProductDto,
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

   // ADD THIS NEW ENDPOINT
  @Get()
  findAll(@GetUser() user) {
    const tenantId = user?.store?.id;
    if (!tenantId) {
      throw new UnauthorizedException('User is not affiliated with a store.');
    }
    return this.productService.findAllForTenant(tenantId);
  }

   @Patch(':id') // Handles PATCH /products/some-product-id
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user,
  ) {
    const tenantId = user?.store?.id;
    if (!tenantId) {
      throw new UnauthorizedException('User is not affiliated with a store.');
    }
    return this.productService.update(tenantId, id, updateProductDto);
  }
}