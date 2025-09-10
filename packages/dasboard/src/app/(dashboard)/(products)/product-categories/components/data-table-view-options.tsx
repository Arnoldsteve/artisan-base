'use client';

import { Table } from '@tanstack/react-table';
import { Input } from '@repo/ui';
import { Button } from '@repo/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';
import { Category } from '@/types/categories';
// import { Category } from '@/types/categories';

interface DataTableViewOptionsProps {
  table: Table<Category>;
}

export function DataTableViewOptions({ table }: DataTableViewOptionsProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      {/* Filter by category name */}
      <Input
        placeholder="Filter by category name..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
        className="max-w-sm"
      />

      {/* Optional: filter by status if categories have an `isActive` or `status` field */}
      {table.getColumn('isActive') && (
        <Select
          value={(table.getColumn('isActive')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) =>
            table.getColumn('isActive')?.setFilterValue(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Clear filters button */}
      <Button variant="outline" onClick={() => table.resetColumnFilters()}>
        Clear Filters
      </Button>
    </div>
  );
}
