import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

export const OrdersEmptyState = () => {
  return (
    <div className="text-center py-8">
      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No orders yet
      </h3>
      <p className="text-muted-foreground mb-4">
        Start shopping to see your order history here
      </p>
      <Button asChild>
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  );
};