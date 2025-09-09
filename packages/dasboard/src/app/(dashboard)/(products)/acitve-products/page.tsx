// app/(dashboard)/(products)/active-products/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { Badge } from "@repo/ui";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  inventoryQuantity: number;
  status: "Active" | "Inactive";
};

// Static mock active products
const activeProducts: Product[] = [
  { id: "1", name: "Laptop Pro 15", sku: "LP1500", price: "$1,299.99", inventoryQuantity: 20, status: "Active" },
  { id: "2", name: "Running Shoes", sku: "RS220", price: "$129.99", inventoryQuantity: 50, status: "Active" },
  { id: "3", name: "Blender Max", sku: "BM330", price: "$79.99", inventoryQuantity: 35, status: "Active" },
  { id: "4", name: "Noise Cancelling Headphones", sku: "NCH400", price: "$199.99", inventoryQuantity: 15, status: "Active" },
];

export default function ActiveProductsPage() {
  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Products</CardTitle>
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
              {activeProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.inventoryQuantity}</TableCell>
                  <TableCell>
                    <Badge variant="success">{product.status}</Badge>
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
