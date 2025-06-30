// src/app/dashboard/customers/[customerId]/components/customer-contact-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Separator } from "@repo/ui";
import { Customer } from "@/types/customers";
import { Mail, Phone } from "lucide-react";

export function CustomerContactCard({ customer }: { customer: Customer }) {
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
                    <p>{customer.firstName} {customer.lastName}</p>
                    <p>{customer.addresses[0].addressLine1}</p>
                    <p>{customer.addresses[0].city}, {customer.addresses[0].state} {customer.addresses[0].postalCode}</p>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}