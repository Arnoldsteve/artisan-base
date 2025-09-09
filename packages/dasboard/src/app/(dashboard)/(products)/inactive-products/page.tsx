// app/(dashboard)/(products)/inactive-products/pages.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { Badge } from "@repo/ui";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  inventoryQuantity: number;
  status: "Inactive" | "Active";
};

// Static mock inactive products
const inactiveProducts: Product[] = [
  { id: "1", name: "Smartphone X100", sku: "SPX100", price: "$699.99", inventoryQuantity: 0, status: "Inactive" },
  { id: "2", name: "Leather Jacket", sku: "LJ200", price: "$249.99", inventoryQuantity: 0, status: "Inactive" },
  { id: "3", name: "Coffee Maker", sku: "CM300", price: "$89.99", inventoryQuantity: 0, status: "Inactive" },
  { id: "4", name: "Wireless Headphones", sku: "WH400", price: "$199.99", inventoryQuantity: 0, status: "Inactive" },
];

export default function InactiveProductsPage() {
  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inactive Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inactiveProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.inventoryQuantity}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{product.status}</Badge>
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
