import React, { useState } from "react";
import { Input } from "@repo/ui/components/ui/input";

const regions = [
  { region: "North America", cost: "$24.99", delivery: "7-10 business days" },
  { region: "Europe", cost: "$29.99", delivery: "8-12 business days" },
  { region: "Asia", cost: "$34.99", delivery: "10-15 business days" },
  { region: "Australia", cost: "$34.99", delivery: "10-15 business days" },
  { region: "Other", cost: "$39.99", delivery: "12-20 business days" },
];

const restrictedItems = [
  "Batteries",
  "Aerosols",
  "Flammable liquids",
  "Perishable goods",
  "Live animals",
  "Currency",
];

export function InternationalShippingTab() {
  const [country, setCountry] = useState("");

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">International Shipping</h3>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Select your country
        </label>
        <Input
          placeholder="Start typing your country..."
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-72"
        />
      </div>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-[400px] w-full bg-white rounded-xl shadow mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold">Region</th>
              <th className="py-3 px-4 text-left font-semibold">
                Shipping Cost
              </th>
              <th className="py-3 px-4 text-left font-semibold">
                Delivery Time
              </th>
            </tr>
          </thead>
          <tbody>
            {regions.map((r) => (
              <tr key={r.region}>
                <td className="py-2 px-4">{r.region}</td>
                <td className="py-2 px-4">{r.cost}</td>
                <td className="py-2 px-4">{r.delivery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Customs & Import Duties</h4>
        <div className="text-sm text-gray-600 mb-1">
          International shipments may be subject to customs fees, import duties,
          and taxes of the destination country. These charges are the
          responsibility of the recipient.
        </div>
        <div className="text-xs text-gray-400">
          Please check with your local customs office for more information.
        </div>
      </div>
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Restricted Items</h4>
        <ul className="list-disc ml-6 text-sm text-gray-600">
          {restrictedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Processing Time</h4>
        <div className="text-sm text-gray-600">
          International orders are processed within 1-3 business days. Delivery
          times may vary by destination and customs processing.
        </div>
      </div>
    </div>
  );
}
