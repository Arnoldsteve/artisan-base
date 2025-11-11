"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Product } from "@/types/products";
import { Card } from "@repo/ui/components/ui/card";

interface DataTableViewOptionsProps {
  table: Table<Product>;
}

export function DataTableViewOptions({ table }: DataTableViewOptionsProps) {
  return (
    <Card className="flex flex-wrap items-center rounded-sm shadow-none gap-4 py-4 px-4 mt-4 mb-8">
      <Input
        placeholder="Filter by name... "
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      <Select
        value={
          (table.getColumn("isActive")?.getFilterValue() as string) ?? "all"
        }
        onValueChange={(value) =>
          table.getColumn("isActive")?.setFilterValue(value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Draft</SelectItem>
        </SelectContent>
      </Select>

      {/* Optional: Add a clear filters button */}
      <Button variant="outline" onClick={() => table.resetColumnFilters()}>
        Clear Filters
      </Button>
    </Card>
  );
}
