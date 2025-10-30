"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Edit, Trash } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import { DashboardUser } from "@/types/users";
import { ConfirmActionModal } from "@/components/modals/confirm-action-modal";

interface CellActionProps {
  data: DashboardUser;
  onEditUser: (user: DashboardUser) => void;
  onDeleteUser: (userId: string) => void; // renamed for clarity
  isDeleting?: boolean; // pass from parent for consistency
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  onEditUser,
  onDeleteUser,
  isDeleting = false,
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const canPerformAction = data.role !== "STAFF";

  const handleConfirmDelete = () => {
    onDeleteUser(data.id);
    setIsDeleteOpen(false);
    toast.success(`User "${data.firstName}" has been deleted.`);
  };

  return (
    <>
      <ConfirmActionModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title={`Delete user "${data.firstName} ${data.lastName}"?`}
        description="This action will permanently remove the user and all related data. It cannot be undone."
        actionLabel="Delete"
        variant="destructive"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => onEditUser(data)}>
            <Edit className="mr-2 h-4 w-4" /> Edit User
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {canPerformAction && (
            <DropdownMenuItem
              onClick={() => setIsDeleteOpen(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
