"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { Button } from "@repo/ui";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useBilling } from "@/hooks/use-billing";
import { Invoice } from "@/types/billing";

interface BillingInvoiceHistoryProps {
  invoices?: Invoice[];
}

export function BillingInvoiceHistory({
  invoices: propInvoices,
}: BillingInvoiceHistoryProps) {
  const { invoices, downloadInvoice, loading, error } = useBilling();
  const allInvoices = propInvoices || invoices;
  if (loading) return <div>Loading invoices...</div>;
  if (error) return <div className="text-destructive">{error}</div>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription>View and download your past invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US").format(
                    new Date(invoice.date)
                  )}
                </TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(invoice.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => downloadInvoice(invoice.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
