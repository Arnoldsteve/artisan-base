"use client";

import React, { useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Button } from "@repo/ui";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./columns";
import { InviteUserDialog } from "./invite-user-dialog";
import { UserTableMeta } from "@/types/table-meta";
import { TenantRole } from "@/types/roles";
import { DashboardUserData } from "@/types/users";

interface TeamMembersViewProps {
  initialUsers: DashboardUserData[];
}

export function TeamMembersView({ initialUsers }: TeamMembersViewProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);

  // --- Local State Handlers ---
  const handleUserInvited = (data: { email: string; role: TenantRole  }) => {
    // Create a new user object for our mock state
    const newUser: DashboardUserData = {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      name: null, // New users don't have a name yet
      email: data.email,
      role: data.role,
      isActive: true, // New users are active by default
      createdAt: new Date().toLocaleDateString(),
    };
    setUsers(current => [newUser, ...current]);
    setIsInviteDialogOpen(false); // Also close dialog on success
  };

  const handleUserDeleted = (userId: string) => {
    setUsers(current => current.filter(u => u.id !== userId));
  };

  // --- Create the meta object with proper typing ---
  const tableMeta: UserTableMeta<DashboardUserData> = {
    handleUserDeleted,
    // You can add handleUserUpdated here in the future
  };
  
  // Create the table instance
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Pass the properly typed meta object
    meta: tableMeta,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage who can access your dashboard.
          </p>
        </div>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>
      <div className="mt-4">
        <DataTable table={table}  totalCount={9} />
      </div>

      <InviteUserDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        onSuccess={handleUserInvited}
      />
    </>
  );
}