"use client";

import React, { useState } from "react";
import { mockReturns } from "./mock-returns";
import { ReturnCard } from "./ReturnCard";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

const filterOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "in_transit", label: "In Transit" },
  { value: "completed", label: "Completed" },
];

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "status", label: "Status" },
];

export function MyReturnsTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  let filtered = mockReturns.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      (r.itemName.toLowerCase().includes(search.toLowerCase()) ||
        r.orderNumber.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === "oldest") filtered = [...filtered].reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search by order number or item name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md h-12 text-base"
          />
        </div>

        <div className="flex gap-3">
          {/* Filter Select */}
          <Select value={filter} onValueChange={(val) => setFilter(val)}>
            <SelectTrigger className="w-32 h-12">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Select */}
          <Select value={sort} onValueChange={(val) => setSort(val)}>
            <SelectTrigger className="w-40 h-12">
              <SelectValue placeholder="Most Recent" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Returns Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((ret) => (
          <ReturnCard key={ret.id} ret={ret} />
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No returns found</h3>
          <p className="text-gray-500">
            {search || filter !== "all"
              ? "Try adjusting your search or filters"
              : "You haven't made any returns yet"}
          </p>
        </div>
      )}
    </div>
  );
}