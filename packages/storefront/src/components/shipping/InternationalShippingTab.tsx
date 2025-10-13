"use client";

import React, { useState } from "react";
import { Input } from "@repo/ui/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";

// Approximate shipping costs from Kenya (in KSh)
const regions = [
  { region: "East Africa", cost: 1500, delivery: "3–5 business days" },
  { region: "Rest of Africa", cost: 3500, delivery: "5–10 business days" },
  { region: "Europe", cost: 5500, delivery: "7–12 business days" },
  { region: "Middle East", cost: 4800, delivery: "6–10 business days" },
  { region: "Asia", cost: 6500, delivery: "8–14 business days" },
  { region: "North America", cost: 7000, delivery: "10–15 business days" },
  { region: "Australia", cost: 8500, delivery: "12–18 business days" },
  { region: "Other Regions", cost: 9000, delivery: "12–20 business days" },
];

const restrictedItems = [
  "Batteries and power banks",
  "Aerosols and sprays",
  "Flammable liquids",
  "Perishable goods",
  "Live animals or plants",
  "Currency or valuables",
];

export function InternationalShippingTab() {
  const [country, setCountry] = useState("");

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">International Shipping</h3>

      {/* Country Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Select your country
        </label>
        <Input
          placeholder="Start typing your destination country..."
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-72"
        />
      </div>

      {/* Shipping Regions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Shipping Regions & Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Region</TableHead>
                <TableHead className="font-semibold">Shipping Cost (KSh)</TableHead>
                <TableHead className="font-semibold">Delivery Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((r) => (
                <TableRow key={r.region}>
                  <TableCell>{r.region}</TableCell>
                  <TableCell>{formatMoney(r.cost)}</TableCell>
                  <TableCell>{r.delivery}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-gray-400 mt-2">
            * Rates are estimates and may vary depending on destination, weight, and courier.
          </p>
        </CardContent>
      </Card>

      {/* Customs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Customs & Import Duties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-1">
            International shipments from Kenya may be subject to customs fees,
            import duties, and taxes imposed by the destination country. These
            charges are the responsibility of the recipient.
          </p>
          <p className="text-xs text-gray-400">
            Please check with your local customs office for applicable charges.
          </p>
        </CardContent>
      </Card>

      {/* Restricted Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Restricted Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 text-sm text-gray-600">
            {restrictedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Processing Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Processing Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            International orders are processed within 1 - 3 business days after payment
            confirmation. Delivery times vary based on the destination, courier, and
            customs processing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
