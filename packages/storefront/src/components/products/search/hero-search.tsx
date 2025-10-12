"use client";

import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";

export function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Products" },
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home", name: "Home & Living" },
    { id: "beauty", name: "Beauty" },
    { id: "sports", name: "Sports" },
  ];

  const trendingSearches = [
    "Wireless Earbuds",
    "Smart Watch",
    "Laptop Stand",
    "Running Shoes",
    "Coffee Maker",
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "in", selectedCategory);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* Search Card */}
      <Card className="rounded-2xl border shadow-md">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Category Selector */}
          <div className="p-4 mx-4 md:p-0 md:w-48 flex items-center justify-center">
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="flex-1 flex items-center p-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands, and more..."
              className="h-12 text-base flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Search Button */}
          <div className="p-4 md:w-48 flex justify-center items-center">
            <Button
              onClick={handleSearch}
              size="lg"
              className="w-full md:w-auto h-12 text-base font-semibold"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Trending Searches */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">Trending:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((term, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery(term)}
              className="rounded-full border-muted-foreground/20 text-muted-foreground hover:text-primary hover:border-primary transition"
            >
              {term}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Categories */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.slice(1).map((category) => (
          <Card
            key={category.id}
            className="group p-4 cursor-pointer border border-border hover:border-primary/50 hover:shadow-md transition-all rounded-xl"
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition">
              <div className="w-6 h-6 bg-primary rounded-full" />
            </div>
            <p className="text-sm font-medium text-center text-foreground group-hover:text-primary transition">
              {category.name}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
