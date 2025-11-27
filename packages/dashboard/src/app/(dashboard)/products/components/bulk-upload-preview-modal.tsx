"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@repo/ui";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/data-table";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import {
  productFormSchema,
  ProductFormData,
} from "@/validation-schemas/products";
import { DataTablePagination } from "@/components/shared/data-table-footer";

export interface BulkProductRow extends ProductFormData {
  isValid: boolean;
  errors: string[];
}

interface BulkUploadModalProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (validRows: BulkProductRow[]) => void;
}

export function BulkUploadModal({
  file,
  isOpen,
  onClose,
  onConfirm,
}: BulkUploadModalProps) {
  const [rows, setRows] = useState<BulkProductRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!file || !isOpen) return;

    const parseFile = async () => {
      try {
        let rawRows: any[] = [];

        if (file.name.endsWith(".csv")) {
          const text = await file.text();
          const lines = text.split("\n").filter(Boolean);
          const headers = lines[0].split(",");
          rawRows = lines.slice(1).map((line) => {
            const values = line.split(",");
            const obj: any = {};
            headers.forEach((h, i) => (obj[h] = values[i]));
            return obj;
          });
        } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          const arrayBuffer = await file.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const headers = json[0] as string[];
          rawRows = json.slice(1).map((row) => {
            const obj: any = {};
            headers.forEach((h, i) => (obj[h] = row[i]));
            return obj;
          });
        } else {
          toast.error("Unsupported file type");
          onClose();
          return;
        }

        const parsedRows: BulkProductRow[] = rawRows.map((row) => {
          const result = productFormSchema.safeParse({
            name: row.Name ?? row.name,
            price: row.Price ?? row.price,
            inventoryQuantity:
              row.Inventory ?? row.inventoryQuantity ?? row.inventoryquantity,
            sku: row.SKU ?? row.sku,
            description: row.Description ?? row.description,
            isActive: ["true", "active", "yes", "1"].includes(
              String(row["Is Active"] ?? row.isActive ?? "true").toLowerCase()
            ),
            isFeatured: ["true", "active", "yes", "1"].includes(
              String(
                row["Is Featured"] ?? row.isFeatured ?? "false"
              ).toLowerCase()
            ),
          });

          if (result.success) {
            return {
              ...result.data, 
              isValid: true,
              errors: [],
            };
          } else {
            return {
              ...row, 
              name: row.Name ?? row.name, 
              isValid: false,
              errors: result.error.errors.map(
                (e) => `${e.path.join(".")}: ${e.message}`
              ),
            };
          }
        });

        setRows(parsedRows);
      } catch (err) {
        toast.error("Failed to parse the file");
        onClose();
      }
    };

    parseFile();
  }, [file, isOpen, onClose]);
  const handleConfirm = () => {
    const validRows = rows.filter((r) => r.isValid);
    // console.log("Valid rows to upload:", validRows);
    if (validRows.length === 0) {
      toast.error("No valid rows to upload");
      return;
    }
    onConfirm(validRows);
    onClose();
  };

  const columns = useMemo<ColumnDef<BulkProductRow>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "price", header: "Price" },
      { accessorKey: "inventoryQuantity", header: "Inventory" },
      { accessorKey: "sku", header: "SKU" },
      {
        accessorKey: "isActive",
        header: "Is Active",
        cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
      },
      {
        accessorKey: "isFeatured",
        header: "Is Featured",
        cell: ({ row }) => (row.original.isFeatured ? "Yes" : "No"),
      },
      { accessorKey: "description", header: "Description" },
      {
        accessorKey: "errors",
        header: "Errors",
        cell: ({ row }) => row.original.errors.join(", "),
      },
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Preview</DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-auto">
          <DataTable table={table}  />
        </div>        

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing}>
            Upload Valid Rows
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
