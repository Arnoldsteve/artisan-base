"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Calendar } from "@repo/ui/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { Download, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface GlobalFiltersBarProps {
  onFiltersChange: (filters: {
    dateRange?: DateRange;
    compareWith?: string;
  }) => void;
  onExport?: (format: "csv" | "excel" | "pdf") => void;
}

export function GlobalFiltersBar({ onFiltersChange, onExport }: GlobalFiltersBarProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [compareWith, setCompareWith] = useState<string>("previous");

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onFiltersChange({ dateRange: range, compareWith });
  };

  const handleCompareChange = (value: string) => {
    setCompareWith(value);
    onFiltersChange({ dateRange, compareWith: value });
  };

  return (
    <div className="sticky top-0 z-50 bg-background border-b p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Quick Presets */}
          <Select defaultValue="30d">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Quick select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Compare With */}
          <Select value={compareWith} onValueChange={handleCompareChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Compare with" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">Previous period</SelectItem>
              <SelectItem value="last-year">Same period last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export Button */}
        <Button variant="outline" onClick={() => onExport?.("csv")}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}