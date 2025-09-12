import React, { useState } from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { validateAddress } from "@/lib/validate-address";
import { shippingOptions } from "@/lib/shipping-options";
import { Address } from "@/types/address";
import { ShippingOption } from "@/types/shipping";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";

export const ShippingAddressStep: React.FC = () => {
  const {
    shippingAddress,
    setShippingAddress,
    selectedShippingOption,
    setShippingOption,
    nextStep,
    previousStep,
  } = useCheckoutContext();
  const [form, setForm] = useState<Address>({
    street: shippingAddress?.street || "",
    city: shippingAddress?.city || "",
    state: shippingAddress?.state || "",
    zipCode: shippingAddress?.zipCode || "",
    country: shippingAddress?.country || "KE",
  });
  const [selectedOption, setSelectedOption] = useState<string>(
    selectedShippingOption?.id || shippingOptions[0].id
  );
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
    const option = shippingOptions.find((opt) => opt.id === selectedOption)!;
    setShippingOption(option);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label className="block text-sm font-medium mb-2">
            Street Address *
          </Label>
          <Input
            name="street"
            value={form.street}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2">City *</Label>
          <Input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2">State *</Label>
          <Input
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2">ZIP Code *</Label>
          <Input
            name="zipCode"
            value={form.zipCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2">Country *</Label>
          <Input
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Shipping Options</h3>
        <div className="space-y-2">
         <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-3"
          >
            {shippingOptions.map((option) => (
              <Card key={option.id} className="p-3 cursor-pointer">
                <CardContent className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="cursor-pointer">
                      <div className="font-medium">{option.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description} ({option.estimatedDays})
                      </div>
                    </Label>
                  </div>
                  <span className="font-semibold">Ksh {option.price.toFixed(2)}</span>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>
      </div>
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
