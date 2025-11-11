"use client";

import { Table } from "@tanstack/react-table";
import { Card } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { CustomerColumn } from "./columns";

interface DataTableViewOptionsProps {
  table: Table<CustomerColumn>;
}

export function DataTableViewOptions({ table }: DataTableViewOptionsProps) {
  return (
    <Card className="flex flex-row items-center w-full rounded-sm shadow-none gap-4 py-4 px-4 mt-4 mb-8">
      <Input
        placeholder="Filter customers by email..."
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("email")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      <Button
        variant="outline"
        onClick={() => table.resetColumnFilters()}
        className="ml-auto"
      >
        Clear Filters
      </Button>
    </Card>
  );
}
