"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Download, Search, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useAnalyticsOverview } from "@/hooks/use-analytics-queries";
import { format } from "date-fns";

export function RecentTransactionsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useAnalyticsOverview();

  // Mock recent transactions - replace with actual API call
  const transactions = data?.data?.recentTransactions || [];

  const filteredData = transactions.filter(
    (transaction: any) =>
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
        return "default";
      case "pending":
        return "secondary";
      case "refunded":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Failed to load recent transactions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((transaction: any) => (
                    <TableRow key={transaction.orderId}>
                      <TableCell className="font-mono text-sm">
                        {transaction.orderId}
                      </TableCell>
                      <TableCell>{transaction.customerName || "Guest"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {new Intl.NumberFormat("en-KE", {
                          style: "currency",
                          currency: "KES",
                        }).format(transaction.amount)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.paymentMethod}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(transaction.date), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}