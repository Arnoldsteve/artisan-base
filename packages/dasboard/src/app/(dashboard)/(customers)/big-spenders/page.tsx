// app/(dashboard)/(customers)/big-spenders/page.tsx
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
  status: "Big Spender" | "Regular";
};

// Static mock big spender customers
const bigSpenders: Customer[] = [
  { id: "1", firstName: "Evelyn", lastName: "Taylor", email: "evelyn@example.com", totalOrders: 12, totalSpent: "$5,200", status: "Big Spender" },
  { id: "2", firstName: "Frank", lastName: "Miller", email: "frank@example.com", totalOrders: 9, totalSpent: "$4,800", status: "Big Spender" },
  { id: "3", firstName: "Grace", lastName: "Davis", email: "grace@example.com", totalOrders: 15, totalSpent: "$6,000", status: "Big Spender" },
  { id: "4", firstName: "Henry", lastName: "Wilson", email: "henry@example.com", totalOrders: 10, totalSpent: "$5,500", status: "Big Spender" },
];

export default function BigSpendersPage() {
  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Big Spenders</CardTitle>
        </CardHeader>
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
              {bigSpenders.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{customer.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
