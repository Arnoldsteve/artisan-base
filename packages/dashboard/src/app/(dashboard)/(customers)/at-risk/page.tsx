// app/(dashboard)/(customers)/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { Badge } from "@repo/ui";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalOrders: number;
  totalSpent: string;
  status: "Loyal" | "Big Spender" | "Regular";
};

// Static mock customers
const loyalCustomers: Customer[] = [
  { id: "1", firstName: "Alice", lastName: "Johnson", email: "alice@example.com", totalOrders: 25, totalSpent: "$3,500", status: "Loyal" },
  { id: "2", firstName: "Bob", lastName: "Smith", email: "bob@example.com", totalOrders: 18, totalSpent: "$2,800", status: "Loyal" },
];

const bigSpenders: Customer[] = [
  { id: "3", firstName: "Evelyn", lastName: "Taylor", email: "evelyn@example.com", totalOrders: 12, totalSpent: "$5,200", status: "Big Spender" },
  { id: "4", firstName: "Frank", lastName: "Miller", email: "frank@example.com", totalOrders: 9, totalSpent: "$4,800", status: "Big Spender" },
];

export default function CustomersDashboardPage() {
  const [tab, setTab] = useState("loyal");

  const renderTable = (customers: Customer[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Total Orders</TableHead>
          <TableHead>Total Spent</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>{customer.firstName} {customer.lastName}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.totalOrders}</TableCell>
            <TableCell>{customer.totalSpent}</TableCell>
            <TableCell>
              <Badge variant={customer.status === "Loyal" ? "default" : "destructive"}>
                {customer.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Customers Dashboard</h1>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="loyal">Loyal Customers</TabsTrigger>
          <TabsTrigger value="bigSpenders">Big Spenders</TabsTrigger>
        </TabsList>

        <TabsContent value="loyal">
          <Card>
            <CardHeader>
              <CardTitle>Loyal Customers</CardTitle>
            </CardHeader>
            <CardContent>{renderTable(loyalCustomers)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bigSpenders">
          <Card>
            <CardHeader>
              <CardTitle>Big Spenders</CardTitle>
            </CardHeader>
            <CardContent>{renderTable(bigSpenders)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
