'use client';


import { PageHeader } from "@/components/shared/page-header";
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
  status: "Loyal" | "Regular";
};

// Static mock loyal customers
const loyalCustomers: Customer[] = [
  { id: "1", firstName: "Alice", lastName: "Johnson", email: "alice@example.com", totalOrders: 25, totalSpent: "$3,500", status: "Loyal" },
  { id: "2", firstName: "Bob", lastName: "Smith", email: "bob@example.com", totalOrders: 18, totalSpent: "$2,800", status: "Loyal" },
  { id: "3", firstName: "Carol", lastName: "Williams", email: "carol@example.com", totalOrders: 22, totalSpent: "$3,200", status: "Loyal" },
  { id: "4", firstName: "David", lastName: "Brown", email: "david@example.com", totalOrders: 15, totalSpent: "$2,100", status: "Loyal" },
];

export default function LoyalCustomersPage() {
  return (
    <>
    <PageHeader title="Loyal Customers" />
    
    <div className="p-8 space-y-6">
      <Card>
        <CardContent>
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
              {loyalCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>
                    <Badge variant="default">{customer.status}</Badge>
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
