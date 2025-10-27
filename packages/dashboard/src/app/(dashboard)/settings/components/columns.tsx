"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@repo/ui/components/ui/badge";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { CellAction } from "./cell-action";
import { UserTableMeta, TableWithMeta } from "@/types/table-meta";
import { DashboardUserData } from "@/types/users";

// REMOVE the global module declaration completely
// No more: declare module '@tanstack/react-table' { ... }

export const columns: ColumnDef<DashboardUserData>[] = [
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
      const name = user.name || user.email;
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
      const variant: "default" | "secondary" | "outline" =
        role === "OWNER"
          ? "default"
          : role === "ADMIN"
            ? "secondary"
            : "outline";
      return (
        <Badge variant={variant} className="capitalize">
          {role.toLowerCase()}
        </Badge>
      );
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
    header: "Date Added",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      // Type assertion for the table with UserTableMeta
      const typedTable = table as TableWithMeta<
        DashboardUserData,
        UserTableMeta<DashboardUserData>
      >;

      return (
        <CellAction
          data={row.original}
          onUserDeleted={typedTable.options.meta!.handleUserDeleted}
        />
      );
    },
  },
];
