"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { usePaymentMethods, useRevenueByCategory } from "@/hooks/use-analytics-queries";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function RevenueBreakdown() {
  const { data: categoryData, isLoading: categoryLoading } = useRevenueByCategory();
  const { data: paymentData, isLoading: paymentLoading } = usePaymentMethods();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="category" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="payment">By Payment Method</TabsTrigger>
          </TabsList>
          
          <TabsContent value="category" className="h-[300px]">
            {categoryLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData?.data || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.category}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {(categoryData?.data || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          
          <TabsContent value="payment" className="h-[300px]">
            {paymentLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentData?.data || []}>
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}