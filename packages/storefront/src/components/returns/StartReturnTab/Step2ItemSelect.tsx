import React, { useState } from "react";
import { mockOrders } from "./mock-orders";
import { Button } from "@repo/ui/components/ui/button";

export function Step2ItemSelect({ selectedOrderId, onNext, onBack }: { selectedOrderId: string; onNext: (selectedItems: any[]) => void; onBack: () => void }) {
  const order = mockOrders.find((o) => o.id === selectedOrderId);
  const [selectedItems, setSelectedItems] = useState<{ [itemId: string]: number }>({});

  if (!order) return <div className="text-red-500">Order not found.</div>;

  const handleCheckbox = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? { ...prev, [itemId]: 1 } : Object.fromEntries(Object.entries(prev).filter(([id]) => id !== itemId))
    );
  };

  const handleQuantity = (itemId: string, qty: number) => {
    setSelectedItems((prev) => ({ ...prev, [itemId]: qty }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select Items to Return</h2>
      <div className="mb-4 p-4 bg-gray-100 rounded flex justify-between items-center">
        <div>
          <span className="font-semibold">Order:</span> {order.id}
          <span className="ml-4 text-sm text-gray-500">{order.date}</span>
        </div>
        <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {order.items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border">
            <div className="flex gap-3 items-center">
              <input
                type="checkbox"
                disabled={!item.eligible}
                checked={!!selectedItems[item.id]}
                onChange={(e) => handleCheckbox(item.id, e.target.checked)}
                aria-label={`Select ${item.name}`}
              />
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-gray-500">Variant: {item.variant}</div>
                <div className="text-xs text-gray-500">${item.price.toFixed(2)}</div>
                <div className={`text-xs mt-1 ${item.eligible ? "text-green-700" : "text-red-500"}`}>
                  {item.eligible ? "Eligible for return" : "Return window expired"}
                </div>
              </div>
            </div>
            {item.eligible && selectedItems[item.id] && (
              <div className="flex items-center gap-2 mt-2">
                <label htmlFor={`qty-${item.id}`} className="text-xs">Qty:</label>
                <input
                  id={`qty-${item.id}`}
                  type="number"
                  min={1}
                  max={3}
                  value={selectedItems[item.id]}
                  onChange={(e) => handleQuantity(item.id, Math.max(1, Math.min(3, Number(e.target.value))))}
                  className="w-16 border rounded px-2 py-1 text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6 gap-2">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button
          onClick={() => onNext(order.items.filter((item) => selectedItems[item.id]))}
          disabled={Object.keys(selectedItems).length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 