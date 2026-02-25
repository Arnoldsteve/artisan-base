"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Button } from "@repo/ui/components/ui/button";
import { DataTable, DataTableSkeleton } from "@/components/shared/data-table";
import { columns } from "./columns"; 
import { UserTableMeta } from "@/types/table-meta";
import { StaffMember } from "@/types/staff";
import { TenantUserRole } from "@/types/roles";
import { PageHeader } from "@/components/shared/page-header";
import { useStaffMembers } from "@/hooks/use-dashboard-users"; // Unified Hook
import { EditAddUserSheet } from "./edit-add-user-sheet";
import { StaffMemberFormData } from "@/validation-schemas/staffMemberSchema";
import { ConfirmActionModal } from "@/components/modals/confirm-action-modal";
import { DataTablePagination } from "@/components/shared/data-table-footer";

export function TeamMembersWrapper() {
  // --- Unified Data Hook ---
  const {
    staff,
    meta,
    isLoading,
    isFetching,
    isError,
    page,
    setPage,
    updateRole,
    isUpdating,
    removeStaff,
    isRemoving,
  } = useStaffMembers(10);

  // --- UI State for Modals/Sheets ---
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<StaffMember | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<StaffMember | null>(null);

  // --- Action Handlers ---
  const openEditSheet = (member: StaffMember) => {
    setMemberToEdit(member);
    setIsSheetOpen(true);
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      removeStaff(memberToRemove.id, {
        onSuccess: () => setMemberToRemove(null),
      });
    }
  };

  const tableMeta: UserTableMeta<StaffMember> = {
    openEditSheet,
    openDeleteDialog: (member) => setMemberToRemove(member),
  };

  const table = useReactTable({
    data: staff,
    columns,
    pageCount: meta?.totalPages || 1,
    manualPagination: true,
    state: {
      pagination: { pageIndex: page - 1, pageSize: 10 },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: page - 1, pageSize: 10 });
        setPage(newState.pageIndex + 1);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    meta: tableMeta,
  });

  const handleSaveChanges = (formData: StaffMemberFormData) => {
    if (memberToEdit) {
      updateRole(
        { id: memberToEdit.id, role: formData.role as TenantUserRole },
        { onSuccess: () => setIsSheetOpen(false) }
      );
    } else {
      // Invite logic would be another mutation in the hook
      console.log("Inviting:", formData.email);
    }
  };

  if (isLoading || isFetching) return <DataTableSkeleton />;
  if (isError) return <div className="p-8 text-red-500">Error loading team data.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <PageHeader title="Team Members">
          <Button variant="outline" size="sm" onClick={() => { setMemberToEdit(null); setIsSheetOpen(true); }}>
            Invite Staff
          </Button>
        </PageHeader>

        <div className="px-4 md:px-2 lg:px-4 md:pb-10 pt-2">
          <DataTable table={table} />
        </div>
      </div>
      
      <DataTablePagination table={table} totalCount={meta?.total || 0} />

      <EditAddUserSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        staffMember={memberToEdit} 
        onSave={handleSaveChanges}
        isPending={isUpdating}
      />

      <ConfirmActionModal
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleConfirmRemove}
        loading={isRemoving}
        title={`Remove ${memberToRemove?.user?.firstName || 'Staff'}?`}
        description="This will revoke their access to this store dashboard immediately."
        actionLabel="Remove Access"
        variant="destructive"
      />
    </div>
  );
}