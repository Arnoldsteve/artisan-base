"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";

export default function ReportsPage() {
  // static data
  const reports = [
    { id: 1, name: "Sales Report", date: "2025-09-01", status: "Completed" },
    { id: 2, name: "Customer Feedback", date: "2025-09-10", status: "Pending" },
    {
      id: 3,
      name: "Inventory Report",
      date: "2025-09-15",
      status: "Completed",
    },
    {
      id: 4,
      name: "Revenue Forecast",
      date: "2025-09-20",
      status: "In Progress",
    },
  ];

  return (
    <>
      <PageHeader title="Reports">
        <Button onClick={() => alert("Add clicked!")}>Add Item</Button>
      </PageHeader>
      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{reports.length}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {reports.filter((r) => r.status === "Completed").length}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {reports.filter((r) => r.status !== "Completed").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Table */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.id}</TableCell>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === "Completed"
                            ? "default"
                            : report.status === "Pending"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
