"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@repo/ui/components/ui/badge";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { UserTableMeta } from "@/types/table-meta";
import { StaffMember } from "@/types/staff";
import { CellAction } from "./cell-action";
import { formatDate } from "@/utils/date";

export const columns: ColumnDef<StaffMember>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "user", // Changed from accessorKey: "name" to id for custom rendering
    header: "Staff Member",
    cell: ({ row }) => {
      const { user } = row.original; // Accessing nested user object
      
      const fullName =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.email.split('@')[0]; // Fallback to email prefix
          
      const fallback = fullName.substring(0, 2).toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="text-xs bg-muted">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm leading-none">
              {fullName}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {user.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Store Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      // Using a secondary badge variant for roles makes them distinct from status
      return (
        <Badge variant="secondary" className="capitalize font-normal text-[11px]">
          {role.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">{isActive ? "Active" : "Suspended"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined Store",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string | Date;

      const formattedDate = formatDate(createdAt);
      const formattedTime = formatDate(createdAt, { includeTime: true })
        .replace(formattedDate + ", ", "")
        .trim();

      return (
        <div className="text-sm">
          <div>{formattedDate}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-tight">
            {formattedTime}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const member = row.original;
      // Using correct Type for meta
      const meta = table.options.meta as UserTableMeta<StaffMember>;

      return (
        <CellAction
          data={member}
          onEditUser={meta.openEditSheet}
          onDeleteUser={meta.openDeleteDialog}
        />
      );
    },
  },
];