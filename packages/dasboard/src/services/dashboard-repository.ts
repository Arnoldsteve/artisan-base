import axios, { AxiosError } from "axios";
import { DashboardData } from "@/types/dashboard";

const bffApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export class DashboardRepository {
  static async fetchDashboardData(): Promise<DashboardData> {
    try {
      const response = await bffApi.get("/dashboard");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch dashboard data."
        );
      }
      throw new Error(
        "An unexpected error occurred while fetching dashboard data."
      );
    }
  }
}
// REFACTOR: Centralized dashboard data fetching for SRP, DRY, and testability.
