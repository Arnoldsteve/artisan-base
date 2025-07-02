import { DashboardRepository } from "./dashboard-repository";

export class DashboardService {
  static async getDashboardData() {
    try {
      const data = await DashboardRepository.fetchDashboardData();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }
}
// REFACTOR: Business logic separated from UI for SRP, testability, and DRY.
