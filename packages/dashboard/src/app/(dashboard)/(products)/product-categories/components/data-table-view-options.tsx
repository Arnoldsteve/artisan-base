"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Category } from "@/types/categories";
import { Card } from "@repo/ui/components/ui/card";

interface DataTableViewOptionsProps {
  table: Table<Category>;
}

export function DataTableViewOptions({ table }: DataTableViewOptionsProps) {
  return (
    <Card className="flex flex-row items-center w-full rounded-sm shadow-none gap-4 py-4 px-4 mt-4 mb-8">
      <Input
        placeholder="Filter by category name..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      <Button
        variant="outline"
        className="ml-auto"
        onClick={() => table.resetColumnFilters()}
      >
        Clear Filters
      </Button>
    </Card>
  );
}
