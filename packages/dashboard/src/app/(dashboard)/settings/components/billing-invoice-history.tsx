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
import { Button } from "@repo/ui"; // Import Spinner
import { Download } from "lucide-react";
import { Invoice } from "@/types/billing";

// --- THIS IS THE FIX ---
// Import the new, specific hooks for invoices
import { useBillingInvoices, useDownloadInvoice } from "@/hooks/use-billing";
import { formatMoney } from "@/utils/money";

interface BillingInvoiceHistoryProps {
  invoices?: Invoice[];
}

export function BillingInvoiceHistory({
  invoices: propInvoices,
}: BillingInvoiceHistoryProps) {
  // Call the specific hook to get invoice data, hydrated by server props
  const {
    data: invoices,
    isLoading,
    error,
  } = useBillingInvoices(propInvoices);

  // Call the specific hook to get the download mutation function and its state
  const { mutate: downloadInvoice, isPending: isDownloading } = useDownloadInvoice();

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription className="text-destructive">
            {error.message || "Could not load invoice history."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription>View and download your past invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            {/* <Spinner /> */}loading
          </div>
        ) : (
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
              {invoices && invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {new Intl.DateTimeFormat("en-US").format(
                        new Date(invoice.date)
                      )}
                    </TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell className="text-right">
                      {formatMoney(invoice.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadInvoice(invoice.id)}
                        disabled={isDownloading}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No invoice history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}