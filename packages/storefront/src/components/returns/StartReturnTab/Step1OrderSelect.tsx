import React, { useState } from "react";
import { mockOrders } from "./mock-orders";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";

export function Step1OrderSelect({
  onNext,
}: {
  onNext: (orderId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const filteredOrders = mockOrders.filter(
    (order) => order.id.toLowerCase().includes(search.toLowerCase())
    // Add email search if you add email to mock data
  );

  return (
    <div className="w-full justify-center">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Select an Order</h2>

      {/* Search input */}
      <div className="mb-6">
        <Input
          placeholder="Enter order number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80"
        />
      </div>

      {/* Orders grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-2 mb-3">
              <div>
                <div className="font-semibold text-base md:text-lg">
                  {order.id}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  {order.date} &middot; {order.itemsCount} items
                </div>
              </div>
              <div className="font-bold text-blue-700 text-sm md:text-lg whitespace-nowrap">
                ${order.total.toFixed(2)}
              </div>
            </div>
            <Button
              className="w-full text-sm md:text-base"
              onClick={() => onNext(order.id)}
            >
              View Items
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
