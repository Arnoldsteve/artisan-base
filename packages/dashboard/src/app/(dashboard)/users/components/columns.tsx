"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@repo/ui/components/ui/badge";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { UserTableMeta, TableWithMeta } from "@/types/table-meta";
import { DashboardUser } from "@/types/users";
import { CellAction } from "./cell-action";
import { formatDate } from "@/utils/date";

export const columns: ColumnDef<DashboardUser>[] = [
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
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      const name =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.email;
      const fallback = name.substring(0, 2).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <span className="capitalize text-sm">{role.toLowerCase()}</span>;
    },
  },

  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Member Since",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string | Date;

      const formattedDate = formatDate(createdAt);
      const formattedTime = formatDate(createdAt, { includeTime: true })
        .replace(formattedDate + ", ", "")
        .trim();

      return (
        <div>
          <div>{formattedDate}</div>
          <div className="text-xs text-muted-foreground">{formattedTime}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta as UserTableMeta<DashboardUser>;

      return (
        <CellAction
          data={user}
          onEditUser={meta.openEditSheet}
          onDeleteUser={meta.openDeleteDialog}
        />
      );
    },
  },
];
