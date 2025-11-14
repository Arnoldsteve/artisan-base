"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import { Button } from "@repo/ui";
import { ChevronDown, FileSpreadsheet, FileText } from "lucide-react";

interface BulkUploadDropdownProps {
  onCsvImport: (file: File) => void;
  onExcelImport: (file: File) => void;
}

export function BulkUploadDropdown({
  onCsvImport,
  onExcelImport,
}: BulkUploadDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "csv" | "excel"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === "csv") {
        onCsvImport(file);
      } else {
        onExcelImport(file);
      }
      setIsOpen(false);
    }
    // Reset input so same file can be selected again
    event.target.value = "";
  };

  return (
    <>
      {/* Hidden file inputs */}
      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "csv")}
      />
      <input
        id="excel-upload"
        type="file"
        accept=".xlsx,.xls,.xlsm"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "excel")}
      />

      {/* Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Bulk Upload
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => document.getElementById("csv-upload")?.click()}
          >
            <FileText className="mr-2 h-4 w-4" />
            Import CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => document.getElementById("excel-upload")?.click()}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Import Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
