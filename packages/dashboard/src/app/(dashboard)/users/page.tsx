import { createServerApiClient } from "@/lib/server-api";
import { TeamMembersView } from "./components/team-members-view";
import { PaginatedResponse } from "@/types/shared";
import { DashboardUser } from "@/types/users";
import { PageHeader } from "@/components/shared/page-header";

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

    // Provide default empty paginated data if request fails
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

  return (
    <>
      <PageHeader title="Team Members" />

      <div className="px-4 md:px-4 lg:px-8 md:mt-0 md:pb-10">
        <TeamMembersView initialUsersData={initialUsersData} />
      </div>
    </>
  );
}
