import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/money";

export function ShippingCostsTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Shipping Costs</h3>

      <div className="overflow-x-auto rounded-xl shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold">Shipping Method</TableHead>
              <TableHead className="font-semibold">Order Value</TableHead>
              <TableHead className="font-semibold">Cost</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>Standard</TableCell>
              <TableCell>{formatMoney(0.00)} - {formatMoney(49.99)}</TableCell>
              <TableCell>{formatMoney(5.99)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Standard</TableCell>
              <TableCell>{formatMoney(50)}+</TableCell>
              <TableCell className="text-green-700 font-semibold">
                FREE
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Express</TableCell>
              <TableCell>Any</TableCell>
              <TableCell>{formatMoney(9.99)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Overnight</TableCell>
              <TableCell>Any</TableCell>
              <TableCell>{formatMoney(19.99)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-600 mt-4">
        * Free standard shipping applies to orders over {formatMoney(50)} (before tax and
        after discounts).
      </div>
      <div className="text-xs text-gray-400 mt-1">
        Shipping costs are calculated at checkout and may vary for international
        orders or special items.
      </div>
    </div>
  );
}
