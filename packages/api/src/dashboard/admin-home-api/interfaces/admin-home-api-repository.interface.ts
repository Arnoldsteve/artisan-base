// File: packages/api/src/dashboard/admin-home-api/interfaces/admin-home-api-repository.interface.ts

import { DashboardKpisResponseDto, DashboardRecentOrdersResponseDto } from "../dto/dashboard-response.dto";

/**
 * This is the token that will be used for dependency injection.
 * When a service asks for 'IAdminHomeApiRepository', NestJS will know
 * which provider to inject.
 */
export const IAdminHomeApiRepository = 'IAdminHomeApiRepository';

/**
 * Defines the contract for the dashboard's data access layer (Repository).
 * Any class that implements this interface must provide these methods.
 * This ensures a clean separation between the service and the database logic.
 */
export interface IAdminHomeApiRepository {
  /**
   * Fetches the Key Performance Indicators (KPIs) for the main dashboard view.
   * @returns A promise that resolves to an object containing the calculated KPIs.
   */
  getKpis(): Promise<DashboardKpisResponseDto>;

  /**
   * Fetches a list of the most recent orders to be displayed on the dashboard.
   * @param limit The maximum number of recent orders to retrieve.
   * @returns A promise that resolves to an object containing an array of recent orders.
   */
  getRecentOrders(limit: number): Promise<DashboardRecentOrdersResponseDto>;
}