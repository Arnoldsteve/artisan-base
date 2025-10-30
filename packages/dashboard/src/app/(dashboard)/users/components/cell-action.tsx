"use client";

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

interface CellActionProps {
  data: DashboardUser;
  onEditUser: (user: DashboardUser) => void;
  onDeleteUser: (user: DashboardUser) => void;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  onEditUser,
  onDeleteUser,
}) => {
  const canPerformAction = data.role !== "STAFF";

  return (
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
            onClick={() => onDeleteUser(data)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
