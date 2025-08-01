// File: packages/api/src/dashboard/admin-home-api/admin-home-api.controller.ts

import { Controller, Get, Scope, UseGuards } from '@nestjs/common';
import { AdminHomeApiService } from './admin-home-api.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller({
    path: 'dashboard/admin-home', 
    scope: Scope.REQUEST, 
}) 
export class AdminHomeApiController {
  constructor(private readonly adminHomeApiService: AdminHomeApiService) {}

  @Get('kpis')
  async getKpis() {
    return this.adminHomeApiService.getKpis();
  }

  @Get('recent-orders')
  async getRecentOrders() {
    return this.adminHomeApiService.getRecentOrders();
  }

  @Get('sales-overview')
  async getSalesOverview() {
    return this.adminHomeApiService.getSalesOverview();
  }
}