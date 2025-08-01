import { 
  DashboardKpisResponseDto, 
  DashboardRecentOrdersResponseDto,
  SalesOverviewResponseDto // <-- Import the new DTO
} from "../dto/dashboard-response.dto";

export const IAdminHomeApiRepository = 'IAdminHomeApiRepository';

export interface IAdminHomeApiRepository {
  getKpis(): Promise<DashboardKpisResponseDto>;

  getRecentOrders(limit: number): Promise<DashboardRecentOrdersResponseDto>;
  
  getSalesOverview(): Promise<SalesOverviewResponseDto>;
}