// src/components/checkout/shipping-address-step.tsx
import React, { useState } from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { validateAddress } from "@/lib/validate-address";
import { Address } from "@/types/address";
import { ShippingOptionsStep } from "./shipping-options-step";

export const ShippingAddressStep: React.FC = () => {
  const { shippingAddress, setShippingAddress, nextStep, previousStep } =
    useCheckoutContext();

  const [form, setForm] = useState<Address>({
    street: shippingAddress?.street || "",
    city: shippingAddress?.city || "",
    state: shippingAddress?.state || "",
    zipCode: shippingAddress?.zipCode || "",
    country: shippingAddress?.country || "KE",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const validationError = validateAddress(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setShippingAddress(form);
    nextStep(); // proceed to shipping options step
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label className="mb-2 block">Street Address *</Label>
          <Input
            name="street"
            value={form.street}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label className="mb-2 block">City *</Label>
          <Input name="city" value={form.city} onChange={handleChange} required />
        </div>
        <div>
          <Label className="mb-2 block">State *</Label>
          <Input name="state" value={form.state} onChange={handleChange} required />
        </div>
        <div>
          <Label className="mb-2 block">ZIP Code *</Label>
          <Input
            name="zipCode"
            value={form.zipCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label className="mb-2 block">Country *</Label>
          <Input
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <ShippingOptionsStep />

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={previousStep}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};
