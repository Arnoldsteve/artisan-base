import React, { useEffect, useState } from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { shippingOptions } from "@/lib/shipping-options";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";

export const ShippingOptionsStep: React.FC = () => {
  const { selectedShippingOption, setShippingOption } = useCheckoutContext();

  const [selectedOption, setSelectedOption] = useState<string>(
    selectedShippingOption?.id || shippingOptions[0].id
  );

  useEffect(() => {
    if (!selectedShippingOption) {
      const defaultOption = shippingOptions[0];
      setShippingOption(defaultOption);
    }
  }, [selectedShippingOption, setShippingOption]);

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    const option = shippingOptions.find((opt) => opt.id === value)!;
    setShippingOption(option); 
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Shipping Options</h2>

      <RadioGroup
        value={selectedOption}
        onValueChange={handleSelect}
        className="space-y-3"
      >
        {shippingOptions.map((option) => (
          <Card key={option.id} className="p-2 px-2 cursor-pointer">
            <CardContent className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="cursor-pointer">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                    {option.estimatedDays && ` (${option.estimatedDays})`}
                  </div>
                </Label>
              </div>
              <span className="font-semibold">
                Ksh {option.price.toFixed(2)}
              </span>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
};
