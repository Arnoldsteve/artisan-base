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
import { CreateDashboardUserDto, DashboardUser } from "@/types/users";
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
import { ConfirmActionModal } from "@/components/modals/confirm-action-modal";

interface TeamMembersWrapperProps {
  initialUsersData: PaginatedResponse<DashboardUser>;
}

export function TeamMembersWrapper({
  initialUsersData,
}: TeamMembersWrapperProps) {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // --- UI State for Modals/Sheets ---
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<DashboardUser | null>(null);
  const [userToEdit, setUserToEdit] = useState<DashboardUser | null>(null);

  // --- Data Hooks ---
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

  // --- Derived Data ---
  const dashboardUsers = useMemo(
    () => paginatedResponse?.data || [],
    [paginatedResponse]
  );

  const totalDashboardUsers = paginatedResponse?.meta?.total ?? 0;

  // --- Actions ---
  const openAddSheet = () => {
    setUserToEdit(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = (user: DashboardUser) => {
    setUserToEdit(user);
    setIsSheetOpen(true);
  };

  const openDeleteDialog = (user: DashboardUser) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteDashboardUser(userToDelete.id, {
        onSuccess: () => setUserToDelete(null),
      });
    }
  };

  const tableMeta: UserTableMeta<DashboardUser> = {
    openEditSheet,
    openDeleteDialog,
  };

  const table = useReactTable({
    data: dashboardUsers,
    columns,
    pageCount:
      paginatedResponse?.meta?.totalPages ??
      (totalDashboardUsers > 0 ? Math.ceil(totalDashboardUsers / pageSize) : 1),
    manualPagination: true,
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
      createDashboardUser(createData as CreateDashboardUserDto, {
        onSuccess: () => setIsSheetOpen(false),
      });
    }
  };

  // --- Loading / Error UI ---
  if (isFetching || (isLoading && !initialUsersData)) {
    return <DataTableSkeleton />;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load user data.</div>;
  }

  return (
    <>
      <PageHeader title="Team Members">
        <Button onClick={openAddSheet}>Invite User</Button>
      </PageHeader>

      <div className="px-4 md:px-4 lg:px-8 md:mt-0 md:pb-10">
        <DataTable table={table} totalCount={totalDashboardUsers} />
      </div>

      <EditAddUserSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        dashboardUser={userToEdit}
        onSave={handleSaveChanges}
        isPending={isCreating || isUpdating}
      />

      <ConfirmActionModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title={`Delete user "${userToDelete?.firstName} ${userToDelete?.lastName}"?`}
        description="This action will permanently remove the user and all related data. It cannot be undone."
        actionLabel="Delete"
        variant="destructive"
      />
    </>
  );
}
