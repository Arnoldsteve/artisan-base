"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { Button } from "@repo/ui/components/ui/button";
import { DataTable, DataTableSkeleton } from "@/components/shared/data-table";
import { columns } from "./columns";
import { UserTableMeta } from "@/types/table-meta";
import { DashboardUserRole } from "@/types/roles";
import { CreateDashboardUserDto, DashboardUserData } from "@/types/users";
import { PageHeader } from "@/components/shared/page-header";
import { PaginatedResponse } from "@/types/shared";
import {
  useCreateDashboardUser,
  useDashboardUsers,
  useDeleteDashboardUser,
  useUpdateDashboardUser,
} from "@/hooks/use-dashboard-users";
import { EditAddUserSheet } from "./edit-add-user-sheet";
import { DashboardUserFormData } from "@/validation-schemas/dashboardUserSchema";

interface TeamMembersViewProps {
  initialUsersData: PaginatedResponse<DashboardUserData>;
}

export function TeamMembersView({ initialUsersData }: TeamMembersViewProps) {
  const [users, setUsers] = useState(initialUsersData);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // --- UI State for Modals/Sheets ---
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dashboardUserToDelete, setDashboardUserToDelete] =
    useState<DashboardUserData | null>(null);
  const [dashboardUserToEdit, setDashboardUserToEdit] =
    useState<DashboardUserData | null>(null);

  const {
    data: paginatedResponse,
    isLoading,
    isError,
    isFetching,
  } = useDashboardUsers(pageIndex + 1, pageSize, "", initialUsersData);

  const { mutate: createDashboardUser, isPending: isCreating } =
    useCreateDashboardUser();
  const { mutate: updateDashboardUser, isPending: isUpdating } =
    useUpdateDashboardUser();
  const { mutate: deleteDashboardUser, isPending: isDeleting } =
    useDeleteDashboardUser();

  const dashboardUsers = useMemo(
    () => paginatedResponse?.data || [],
    [paginatedResponse]
  );

  const totalDashboardUsers = paginatedResponse?.meta?.total ?? 0;
 

  const openAddSheet = () => {
    // setUsers(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = () => {
    setUsers(initialUsersData);
    setIsSheetOpen(true);
  };

  const handleUserDeleted = (userId: string) => {
    // setUsers((current) => current.filter((u) => u.id !== userId));
  };

  const tableMeta: UserTableMeta<DashboardUserData> = {
    handleUserDeleted,
    openEditSheet,
  };

  const table = useReactTable({
    data: dashboardUsers,
    columns,
    pageCount:
      paginatedResponse?.meta?.totalPages ??
      (totalDashboardUsers > 0 ? Math.ceil(totalDashboardUsers / pageSize) : 1),
    manualPagination: true,
    // state: {
    //   pagination {pageIndex, pageSize},
    // }
    getCoreRowModel: getCoreRowModel(),
    meta: tableMeta,
  });

  const handleSaveChanges = (formData: DashboardUserFormData) => {
    if (formData.id) {
      const { id, ...updateData } = formData;
      updateDashboardUser(
        { id, data: updateData },
        {
          onSuccess: () => setIsSheetOpen(false),
        }
      );
    } else {
      const { id, ...createData } = formData;
      (createDashboardUser(createData as CreateDashboardUserDto),
        {
          onSuccess: () => setIsSheetOpen(false),
        });
    }
  };

  if (isFetching || (isLoading && !initialUsersData)) {
    return <DataTableSkeleton />;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load product data.</div>;
  }

  return (
    <>
      <PageHeader title="Team Members">
        <Button onClick={openAddSheet}> Invite User</Button>
      </PageHeader>

      <DataTable table={table} totalCount={totalDashboardUsers} />

      <EditAddUserSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        dashboardUser={dashboardUserToEdit}
        onSave={handleSaveChanges}
        isPending={isCreating || isUpdating}
      />
    </>
  );
}
