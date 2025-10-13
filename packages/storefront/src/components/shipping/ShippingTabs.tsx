"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShippingInfoTab } from "./ShippingInfoTab";
import { InternationalShippingTab } from "./InternationalShippingTab";
import { OrderProcessingTab } from "./OrderProcessingTab";
import { TrackOrderTab } from "./TrackOrderTab";
import { Button } from "@repo/ui/components/ui/button";
import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

// Tab config
const tabs = [
  {
    id: "shipping-info",
    label: "Shipping Info",
    component: <ShippingInfoTab />, 
  },
  {
    id: "international",
    label: "International Shipping",
    component: <InternationalShippingTab />,
  },
  {
    id: "processing",
    label: "Order Processing",
    component: <OrderProcessingTab />,
  },
  {
    id: "track",
    label: "Track Your Order",
    component: <TrackOrderTab />,
  },
];

// export function ShippingTabs() {
//   const [activeTab, setActiveTab] = React.useState("shipping-info");

//   return (
//     <div className="min-h-screen bg-gray-50 mb-8">

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 mb-8">
//         {/* Tab navigation */}
//         <div className="bg-white border-b border-gray-200 sticky top-0 mb-8  z-10">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* Desktop nav */}
//             <TabsList className="hidden sm:inline-flex h-auto w-auto bg-transparent p-0 space-x-4 lg:space-x-8">
//               {tabs.map((tab) => (
//                 <TabsTrigger
//                   key={tab.id}
//                   value={tab.id}
//                   className="rounded-none border-b-2 border-transparent bg-transparent px-1 py-4 font-medium text-sm text-gray-500 shadow-none transition-none 
//                   data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 hover:text-gray-700"
//                 >
//                   {tab.label}
//                 </TabsTrigger>
//               ))}
//             </TabsList>

//             {/* Mobile select */}
//             <div className="sm:hidden py-3">
//               <Select value={activeTab} onValueChange={setActiveTab}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select a tab" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {tabs.map((tab) => (
//                     <SelectItem key={tab.id} value={tab.id}>
//                       {tab.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>

//         {/* Tab panels */}
//         <div className="flex-1">
//           {tabs.map((tab) => (
//             <TabsContent key={tab.id} value={tab.id} className="mt-0">
//               {tab.component}
//             </TabsContent>
//           ))}
//         </div>
//       </Tabs>
//     </div>
//   );
// }

export function ShippingTabs() {
  const [activeTab, setActiveTab] = React.useState("shipping-info");
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  // Show loading skeleton if auth still loading
  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 mb-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 mb-8">
        {/* Tab navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 mb-8 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TabsList className="hidden sm:inline-flex h-auto w-auto bg-transparent p-0 space-x-4 lg:space-x-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-2 border-transparent bg-transparent px-1 py-4 font-medium text-sm text-gray-500 shadow-none transition-none 
                  data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 hover:text-gray-700"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Mobile select */}
            <div className="sm:hidden py-3">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a tab" />
                </SelectTrigger>
                <SelectContent>
                  {tabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tab panels */}
        <div className="flex-1">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {/* 🚀 Restrict Track tab */}
              {tab.id === "track" ? (
                isAuthenticated ? (
                  <TrackOrderTab />
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-600 mb-4">
                      Please log in to track your orders.
                    </p>
                    <Button
                      onClick={() =>
                        router.push("/auth/login?redirect=/shipping?tab=track")
                      }
                    >
                      Login to Continue
                    </Button>
                  </div>
                )
              ) : (
                tab.component
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
