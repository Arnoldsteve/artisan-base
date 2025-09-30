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

const regions = [
  { region: "North America", cost: "24.99", delivery: "7-10 business days" },
  { region: "Europe", cost: "29.99", delivery: "8-12 business days" },
  { region: "Asia", cost: "34.99", delivery: "10-15 business days" },
  { region: "Australia", cost: "34.99", delivery: "10-15 business days" },
  { region: "Other", cost: "39.99", delivery: "12-20 business days" },
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

      {/* Country Selector */}
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

      {/* Shipping Regions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Shipping Regions & Costs</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Region</TableHead>
                <TableHead className="font-semibold">Shipping Cost</TableHead>
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
        </CardContent>
      </Card>

      {/* Customs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Customs & Import Duties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-1">
            International shipments may be subject to customs fees, import
            duties, and taxes of the destination country. These charges are the
            responsibility of the recipient.
          </p>
          <p className="text-xs text-gray-400">
            Please check with your local customs office for more information.
          </p>
        </CardContent>
      </Card>

      {/* Restricted Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Restricted Items</CardTitle>
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
          <CardTitle className="text-base">Processing Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            International orders are processed within 1-3 business days.
            Delivery times may vary by destination and customs processing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
