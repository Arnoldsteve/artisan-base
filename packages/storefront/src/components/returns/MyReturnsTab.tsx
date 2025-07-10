import React, { useState } from "react";
import { mockReturns } from "./mock-returns";
import { ReturnCard } from "./ReturnCard";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";

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
    <div>
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <Input
          placeholder="Search by order number or item name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((ret) => (
          <ReturnCard key={ret.id} ret={ret} />
        ))}
      </div>
    </div>
  );
} 