import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { OrderItem } from "@/types/orders";
import Image from "next/image";
import { formatMoney } from "@/utils/money";

export function OrderItemsTable({ items }: { items: OrderItem[] }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Image
                    src={
                      item.product?.images?.[0]?.url ?? 
                      `https://picsum.photos/400/400?random=${item.id}`
                    }
                    alt={item.productName || "Product Image"}
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {item.productName}
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatMoney(Number(item.unitPrice))}
                </TableCell>
                <TableCell className="text-right">
                  {formatMoney(Number(item.unitPrice) * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
