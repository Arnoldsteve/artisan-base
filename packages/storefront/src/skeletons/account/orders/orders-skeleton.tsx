import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/components/ui/card";

export const OrdersSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your past orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="w-full border rounded-lg p-4 bg-muted/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-20 bg-muted rounded"></div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 w-16 bg-muted rounded ml-auto"></div>
                  <div className="h-5 w-20 bg-muted rounded ml-auto"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="h-3 w-40 bg-muted rounded"></div>
                  <div className="h-3 w-10 bg-muted rounded"></div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="h-3 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-12 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};