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
import { StaffMember } from "@/types/staff";
import { TenantUserRole } from "@/types/roles";
import { PageHeader } from "@/components/shared/page-header";
import { PaginatedResponse } from "@/types/shared";
import {
  useStaffMembers,
  useUpdateStaffRole,
  useRemoveStaff,
} from "@/hooks/use-dashboard-users";
import { EditAddUserSheet } from "./edit-add-user-sheet";
import { StaffMemberFormData } from "@/validation-schemas/staffMemberSchema";
import { ConfirmActionModal } from "@/components/modals/confirm-action-modal";
import { DataTablePagination } from "@/components/shared/data-table-footer";

interface TeamMembersWrapperProps {
  initialStaffData?: PaginatedResponse<StaffMember>;
}

export function TeamMembersWrapper({
  initialStaffData,
}: TeamMembersWrapperProps) {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // --- UI State for Modals/Sheets ---
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<StaffMember | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<StaffMember | null>(null);

  // --- Data Hooks ---
  const {
    data: paginatedResponse,
    isLoading,
    isError,
    isFetching,
  } = useStaffMembers(pageIndex + 1, pageSize);

  const { mutate: updateRole, isPending: isUpdating } = useUpdateStaffRole();
  const { mutate: removeStaff, isPending: isRemoving } = useRemoveStaff();

  // --- Derived Data ---
  const staffMembers = useMemo(
    () => paginatedResponse?.data || [],
    [paginatedResponse]
  );

  const totalStaff = paginatedResponse?.meta?.total ?? 0;

  // --- Actions ---
  const openAddSheet = () => {
    setMemberToEdit(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = (member: StaffMember) => {
    setMemberToEdit(member);
    setIsSheetOpen(true);
  };

  const openDeleteDialog = (member: StaffMember) => {
    setMemberToRemove(member);
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      removeStaff(memberToRemove.id, {
        onSuccess: () => setMemberToRemove(null),
      });
    }
  };

  // --- Table Meta ---
  const tableMeta: UserTableMeta<StaffMember> = {
    openEditSheet,
    openDeleteDialog,
  };

  const table = useReactTable({
    data: staffMembers,
    columns,
    pageCount:
      paginatedResponse?.meta?.totalPages ??
      (totalStaff > 0 ? Math.ceil(totalStaff / pageSize) : 1),
    manualPagination: true,
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    meta: tableMeta,
  });

  /**
   * Handles saving changes from the Sheet.
   * If memberToEdit exists, we are updating a role.
   * Otherwise, we are inviting a new member.
   */
  const handleSaveChanges = (formData: StaffMemberFormData) => {
    if (memberToEdit) {
      // ✅ Update existing member role
      updateRole(
        { id: memberToEdit.id, role: formData.role as TenantUserRole },
        { onSuccess: () => setIsSheetOpen(false) }
      );
    } else {
      // ✅ TODO: Implement Invite Logic
      // this.inviteService.sendInvite(formData.email, formData.role);
      console.log("Inviting new staff:", formData.email);
    }
  };

  // --- Loading / Error UI ---
  if (isFetching || (isLoading && !initialStaffData)) {
    return <DataTableSkeleton />;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load staff data.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <PageHeader title="Team Members">
          <Button variant={"outline"} size={"sm"} onClick={openAddSheet}>
            Invite Staff
          </Button>
        </PageHeader>

        <div className="px-4 md:px-2 lg:px-4 md:mt-0 md:pb-10 pt-2">
          <DataTable table={table} />
        </div>
      </div>
      
      <DataTablePagination table={table} totalCount={totalStaff} />

      {/* Slide-over for Adding/Editing */}
      <EditAddUserSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        staffMember={memberToEdit} 
        onSave={handleSaveChanges}
        isPending={isUpdating}
      />

      {/* Confirmation for Removal */}
      <ConfirmActionModal
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleConfirmRemove}
        loading={isRemoving}
        title={`Remove ${memberToRemove?.user?.firstName || 'Staff'}?`}
        description="This will revoke their access to this store. They will no longer be able to log in to this specific dashboard."
        actionLabel="Remove Access"
        variant="destructive"
      />
    </div>
  );
}