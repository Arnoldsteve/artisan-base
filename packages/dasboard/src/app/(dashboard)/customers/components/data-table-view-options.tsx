"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@repo/ui";
import { Button } from "@repo/ui";
import { CustomerColumn } from "./columns"; // Import the specific column type

interface DataTableViewOptionsProps {
  // Use the generic `Table` type but specify it's for `CustomerColumn`
  table: Table<CustomerColumn>;
}

/**
 * A component providing filter controls specifically for the Customers data table.
 */
export function DataTableViewOptions({ table }: DataTableViewOptionsProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      {/* 
        Filter by 'name' or 'email'. We'll use the 'email' column for filtering
        since 'name' is a composite field.
      */}
      <Input
        placeholder="Filter customers by email..."
        // The table instance gives us access to the 'email' column object
        value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('email')?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      
      {/* 
        This component no longer needs a status filter, as 'isActive'
        does not exist on the Customer type. We can remove it.
      */}

      {/* A button to clear all active filters */}
      <Button 
        variant="outline" 
        onClick={() => table.resetColumnFilters()}
        className="ml-auto" // Pushes the button to the right
      >
        Clear Filters
      </Button>
    </div>
  );
}