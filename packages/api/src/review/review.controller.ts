import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';

// --- Guards & Decorators ---
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantMembershipGuard } from '@/auth/guards/tenant-membership.guard';
import { TenantRolesGuard } from '@/auth/guards/tenant-roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';

// --- Business Logic ---
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('Product Reviews')
@ApiHeader({ 
  name: 'x-tenant-id', 
  description: 'The unique ID of the store', 
  required: true 
})
@Controller('reviews')
@UseGuards(JwtAuthGuard, TenantMembershipGuard, TenantRolesGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * PUBLIC: Submit a review.
   * millions of users: Handled without a Staff JWT via @Public()
   */
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new product review (Public Storefront)' })
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  /**
   * PUBLIC: Get all reviews for a product.
   */
  @Public()
  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all reviews for a specific product' })
  async findByProduct(@Param('productId') productId: string) {
    return this.reviewService.getProductReviews(productId);
  }

  /**
   * PRIVATE: List all reviews for the store (Dashboard).
   * millions of users: Requires authentication and membership.
   */
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'List all reviews for the current store (Dashboard)' })
  async findAll() {
    return this.reviewService.findAll();
  }
  
  /**
   * PUBLIC: Get aggregated rating summary.
   * Useful for "Star" displays on product cards.
   */
  @Public()
  @Get('product/:productId/summary')
  @ApiOperation({ summary: 'Get average rating and count for a product' })
  async getSummary(@Param('productId') productId: string) {
    return this.reviewService.getRatingSummary(productId);
  }

  /**
   * PRIVATE: Delete a review (Moderation).
   * Only Owners and Admins can delete customer reviews.
   */
  @ApiBearerAuth()
  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Delete a review (Dashboard Moderation)' })
  @ApiResponse({ status: 200, description: 'Review removed successfully.' })
  async remove(@Param('id') id: string) {
    return this.reviewService.removeReview(id);
  }
}