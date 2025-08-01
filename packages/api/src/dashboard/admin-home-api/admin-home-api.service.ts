// File: packages/api/src/dashboard/admin-home-api/admin-home-api.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { IAdminHomeApiRepository } from './interfaces/admin-home-api-repository.interface';

@Injectable()
export class AdminHomeApiService {
  constructor(
    @Inject(IAdminHomeApiRepository)
    private readonly repository: IAdminHomeApiRepository,
  ) {}

  async getKpis() {
    return this.repository.getKpis();
  }

  async getRecentOrders() {
    return this.repository.getRecentOrders(5); // Default to 5 recent orders
  }
}