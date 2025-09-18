'use client';

import { ColumnDef } from '@tanstack/react-table';
// import { DashboardUserData } from '../page';
import { Badge, Checkbox, Avatar, AvatarFallback } from '@repo/ui';
import { CellAction } from './cell-action';
import { DashboardUserData } from '@/lib/mock-data/users';

// Extend TableMeta to let our column know about the delete handler
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    handleUserDeleted: (userId: string) => void;
  }
}

export const columns: ColumnDef<DashboardUserData>[] = [
  {
    id: "select",
    header: ({ table }) => ( <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" /> ),
    cell: ({ row }) => ( <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" /> ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original;
      const name = user.name || user.email;
      const fallback = name.substring(0, 2).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10"><AvatarFallback>{fallback}</AvatarFallback></Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const variant: "default" | "secondary" | "outline" = role === 'OWNER' ? 'default' : role === 'ADMIN' ? 'secondary' : 'outline';
      return ( <Badge variant={variant} className="capitalize">{role.toLowerCase()}</Badge> );
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return ( <Badge variant={isActive ? 'default' : 'destructive'}>{isActive ? 'Active' : 'Inactive'}</Badge> );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Added',
  },
  {
    id: 'actions',
    cell: ({ row, table }) => (
      <CellAction
        data={row.original}
        onUserDeleted={table.options.meta!.handleUserDeleted}
      />
    ),
  },
];