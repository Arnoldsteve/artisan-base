import React, { useState } from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { validateAddress } from "@/lib/validate-address";
import { shippingOptions } from "@/lib/shipping-options";
import { Address } from "@/types/address";
import { ShippingOption } from "@/types/shipping";

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
    country: shippingAddress?.country || "US",
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
          <label className="block text-sm font-medium mb-2">
            Street Address *
          </label>
          <Input
            name="street"
            value={form.street}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">City *</label>
          <Input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">State *</label>
          <Input
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">ZIP Code *</label>
          <Input
            name="zipCode"
            value={form.zipCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Country *</label>
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
          {shippingOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 p-3 border rounded cursor-pointer"
            >
              <input
                type="radio"
                name="shippingOption"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                className="accent-primary"
              />
              <span className="flex-1">
                <span className="font-medium">{option.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {option.description} ({option.estimatedDays})
                </span>
              </span>
              <span className="font-semibold">${option.price.toFixed(2)}</span>
            </label>
          ))}
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
