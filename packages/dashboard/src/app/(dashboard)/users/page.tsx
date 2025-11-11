import { createServerApiClient } from "@/lib/server-api";
import { TeamMembersWrapper } from "./components/team-members-wrapper";
import { PaginatedResponse } from "@/types/shared";
import { DashboardUser } from "@/types/users";

export default async function TeamPage() {
  let initialUsersData: PaginatedResponse<DashboardUser>;

  try {
    const serverApi = await createServerApiClient();

    const response = await serverApi.get<PaginatedResponse<DashboardUser>>(
      "/dashboard/users",
      { page: 1, limit: 10 }
    );

    initialUsersData = response;
  } catch (err) {
    console.error("Failed to fetch team members on server:", err);

    initialUsersData = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        prev: null,
        next: null,
      },
    };
  }

  return <TeamMembersWrapper initialUsersData={initialUsersData} />;
}