import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
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

  @Patch(':id')
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Set success status to 204
  remove(@Param('id') id: string, @GetUser() user) {
    const tenantId = user?.store?.id;

    if (!tenantId) {
      throw new UnauthorizedException('User is not affiliated with a store.');
    }
    // No need to return anything, as the service call is awaited
    // and any errors will be caught by NestJS's exception filter.
    this.productService.delete(tenantId, id);
  }
}
