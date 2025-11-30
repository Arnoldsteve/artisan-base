"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Download, Search, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAnalyticsOverview } from "@/hooks/use-analytics-queries";
import { formatDate } from "@/utils/date";
import { formatMoney } from "@/utils/money";

export function RefundsReturnsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useAnalyticsOverview();

  // Mock refunds data - replace with actual API call
  const refunds = data?.data?.refunds || [];

  const filteredData = refunds.filter(
    (refund: any) =>
      refund.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">
            Failed to load refunds data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Refunds & Returns</CardTitle>
            {refunds.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                {refunds.length}
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or reason..."
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
              <div
                key={i}
                className="h-12 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((refund: any) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-mono text-sm">
                        {refund.orderId}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {refund.reason}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatMoney(refund.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(refund.status)}>
                          {refund.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(refund.date)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No refunds or returns found
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
