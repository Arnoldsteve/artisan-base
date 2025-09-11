'use client';

import { Table } from '@tanstack/react-table';
import { Input } from '@repo/ui';
import { Button } from '@repo/ui';
import { Category } from '@/types/categories';

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
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      {/* Clear filters button */}
      <Button
        variant="outline"
        onClick={() => table.resetColumnFilters()}
      >
        Clear Filters
      </Button>
    </div>
  );
}
