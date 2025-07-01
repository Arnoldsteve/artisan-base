'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { Button } from "@repo/ui";
import { Download } from "lucide-react";
import { toast } from "sonner";

type Invoice = { id: string; date: Date; amount: number; status: 'PAID' | 'DUE' | 'FAILED' };

interface BillingInvoiceHistoryProps {
  invoices: Invoice[];
}

export function BillingInvoiceHistory({ invoices }: BillingInvoiceHistoryProps) {
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
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{new Intl.DateTimeFormat('en-US').format(invoice.date)}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon" onClick={() => toast.info("Downloading invoice...")}>
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