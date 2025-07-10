import React from "react";

export function ShippingCostsTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Shipping Costs</h3>
      <div className="overflow-x-auto">
        <table className="min-w-[400px] w-full bg-white rounded-xl shadow mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold">
                Shipping Method
              </th>
              <th className="py-3 px-4 text-left font-semibold">Order Value</th>
              <th className="py-3 px-4 text-left font-semibold">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4">Standard</td>
              <td className="py-2 px-4">$0 - $49.99</td>
              <td className="py-2 px-4">$5.99</td>
            </tr>
            <tr>
              <td className="py-2 px-4">Standard</td>
              <td className="py-2 px-4">$50+</td>
              <td className="py-2 px-4 text-green-700 font-semibold">FREE</td>
            </tr>
            <tr>
              <td className="py-2 px-4">Express</td>
              <td className="py-2 px-4">Any</td>
              <td className="py-2 px-4">$9.99</td>
            </tr>
            <tr>
              <td className="py-2 px-4">Overnight</td>
              <td className="py-2 px-4">Any</td>
              <td className="py-2 px-4">$19.99</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-sm text-gray-600 mb-2">
        * Free standard shipping applies to orders over $50 (before tax and
        after discounts).
      </div>
      <div className="text-xs text-gray-400">
        Shipping costs are calculated at checkout and may vary for international
        orders or special items.
      </div>
    </div>
  );
}
