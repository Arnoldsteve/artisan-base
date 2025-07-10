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
    <div>
      <h2 className="text-xl font-bold mb-4">Select an Order</h2>
      <Input
        placeholder="Enter order number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-72"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{order.id}</div>
                <div className="text-sm text-gray-500">
                  {order.date} &middot; {order.itemsCount} items
                </div>
              </div>
              <div className="font-bold text-blue-700 text-lg">
                ${order.total.toFixed(2)}
              </div>
            </div>
            <Button className="mt-2 w-full" onClick={() => onNext(order.id)}>
              View Items
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
