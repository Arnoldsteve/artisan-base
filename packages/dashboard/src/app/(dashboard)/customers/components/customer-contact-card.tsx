'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { Customer } from "@/types/customers";
import { Mail, Phone } from "lucide-react";

export function CustomerContactCard({ customer }: { customer: Customer }) {
  const defaultAddress =
    customer.addresses && customer.addresses.length > 0
      ? customer.addresses[0]
      : null;

  return (
    <Card>
        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${customer.email}`} className="text-blue-500 hover:underline">{customer.email}</a>
            </div>
            <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone || 'N/A'}</span>
            </div>
            <Separator />
            <div>
                <h4 className="font-semibold mb-2">Default Address</h4>
                <div className="text-muted-foreground">
                    {defaultAddress ? (
                        <>
                            <p>{defaultAddress.firstName} {defaultAddress.lastName}</p>
                            <p>{defaultAddress.addressLine1}</p>
                            {defaultAddress.addressLine2 && <p>{defaultAddress.addressLine2}</p>}
                            <p>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}</p>
                            <p>{defaultAddress.country}</p>
                        </>
                    ) : (
                        <p>No address on file.</p>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
  );
}