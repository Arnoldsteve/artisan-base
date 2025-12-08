
// analytics.dto.ts
import { IsEnum, IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum GroupByPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum LocationGroupBy {
  CITY = 'city',
  STATE = 'state',
  COUNTRY = 'country',
}

export enum CohortPeriod {
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export class DateRangeDto {
  @ApiPropertyOptional({ description: 'Start date (ISO 8601)', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO 8601)', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class RevenueTrendQueryDto extends DateRangeDto {
  @ApiProperty({ enum: GroupByPeriod, example: GroupByPeriod.MONTH })
  @IsEnum(GroupByPeriod)
  groupBy: GroupByPeriod;

  @ApiPropertyOptional({ description: 'Compare with previous period', example: true })
  @IsOptional()
  compareWith?: boolean;
}

export class TopItemsQueryDto extends DateRangeDto {
  @ApiPropertyOptional({ description: 'Number of items to return', example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class SalesByLocationQueryDto extends DateRangeDto {
  @ApiProperty({ enum: LocationGroupBy, example: LocationGroupBy.CITY })
  @IsEnum(LocationGroupBy)
  groupBy: LocationGroupBy;
}

export class InactiveProductsQueryDto {
  @ApiPropertyOptional({ description: 'Days since last sale', example: 30, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  days?: number = 30;
}

export class CustomerRetentionQueryDto {
  @ApiProperty({ enum: CohortPeriod, example: CohortPeriod.MONTH })
  @IsEnum(CohortPeriod)
  cohortPeriod: CohortPeriod;
}

// ============================================
// RESPONSE DTOs (for API responses)
// ============================================

export class RevenueMetricsResponseDto {
  @ApiProperty({ example: 150000.50 })
  totalRevenue: number;

  @ApiProperty({ example: 140000.00 })
  paidRevenue: number;

  @ApiProperty({ example: 10000.50 })
  pendingRevenue: number;

  @ApiProperty({ example: 500.00 })
  refundedRevenue: number;

  @ApiProperty({ example: 5000.00 })
  averageOrderValue: number;

  @ApiPropertyOptional()
  comparison?: {
    previousPeriodRevenue: number;
    percentageChange: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export class RevenueTrendResponseDto {
  @ApiProperty({ example: '2024-11' })
  period: string;

  @ApiProperty({ example: 50000.00 })
  revenue: number;

  @ApiProperty({ example: 25 })
  orderCount: number;

  @ApiProperty({ example: 2000.00 })
  averageOrderValue: number;
}

export class CategoryRevenueResponseDto {
  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  orderCount: number;

  @ApiProperty()
  productCount: number;

  @ApiProperty()
  percentage: number;
}

export class PaymentProviderResponseDto {
  @ApiProperty()
  provider: string;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  orderCount: number;

  @ApiProperty()
  successRate: number;

  @ApiProperty()
  percentage: number;
}

export class OrderMetricsResponseDto {
  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  pendingOrders: number;

  @ApiProperty()
  deliveredOrders: number;

  @ApiProperty()
  cancelledOrders: number;

  @ApiProperty({ description: 'Average processing time in hours' })
  averageProcessingTime: number;
}

export class OrderStatusResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  percentage: number;
}

export class SalesVelocityResponseDto {
  @ApiProperty()
  ordersPerDay: number;

  @ApiProperty()
  revenuePerDay: number;

  @ApiProperty()
  ordersPerWeek: number;

  @ApiProperty()
  revenuePerWeek: number;
}

export class DayOfWeekResponseDto {
  @ApiProperty()
  dayOfWeek: number;

  @ApiProperty()
  dayName: string;

  @ApiProperty()
  orderCount: number;

  @ApiProperty()
  revenue: number;
}

export class CustomerMetricsResponseDto {
  @ApiProperty()
  totalCustomers: number;

  @ApiProperty()
  newCustomers: number;

  @ApiProperty()
  returningCustomers: number;

  @ApiProperty()
  averageLifetimeValue: number;
}

export class TopCustomerResponseDto {
  @ApiProperty()
  customerId: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  totalSpent: number;

  @ApiProperty()
  averageOrderValue: number;

  @ApiProperty()
  lastOrderDate: Date;
}

export class BestSellingProductResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  categoryName?: string;

  @ApiProperty()
  unitsSold: number;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  averagePrice: number;

  @ApiProperty()
  currentStock: number;
}

export class LocationResponseDto {
  @ApiProperty()
  location: string;

  @ApiProperty()
  orderCount: number;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  customerCount: number;

  @ApiProperty()
  averageOrderValue: number;
}

export class OverviewMetricsResponseDto {
  @ApiProperty({ type: RevenueMetricsResponseDto })
  revenue: RevenueMetricsResponseDto;

  @ApiProperty({ type: OrderMetricsResponseDto })
  orders: OrderMetricsResponseDto;

  @ApiProperty({ type: CustomerMetricsResponseDto })
  customers: CustomerMetricsResponseDto;

  @ApiProperty()
  products: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalInventoryValue: number;
  };
}