import React, { useState } from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { paymentMethods } from "@/utils/payment-methods";
import { paymentSchema } from "@/validation-schemas/payment-schema";
import { RequiredLabel } from "../RequiredLabel";
import { ArrowLeft, ArrowRight } from "lucide-react";


export const PaymentStep: React.FC = () => {
  const { selectedPaymentMethod, setPaymentMethod, nextStep, previousStep } =
    useCheckoutContext();
  const [selected, setSelected] = useState(
    selectedPaymentMethod?.id || paymentMethods[0].id
  );
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [error, setError] = useState<string | null>(null);

 const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "expiry") {
      // Keep only digits
      newValue = value.replace(/\D/g, "");

      // Insert slash after MM
      if (newValue.length >= 3) {
        newValue = newValue.slice(0, 2) + "/" + newValue.slice(2, 4);
      }
    }

    setCard((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleNext = () => {
    const method = paymentMethods.find((m) => m.id === selected)!;

    const result = paymentSchema.safeParse({
      method: method.id,
      card: method.type === "credit_card" ? card : undefined,
    });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setPaymentMethod(method);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <div className="space-y-2">
       <RadioGroup
        value={selected}
        onValueChange={setSelected}
        className="space-y-3"
      >
        {paymentMethods.map((method) => (
          <Card key={method.id} className="p-3 cursor-pointer">
            <CardContent className="flex items-center gap-3">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                {method.name}
              </Label>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
      </div>
      {selected === "credit_card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
           <div className="md:col-span-2">
            <RequiredLabel>Cardholder Name </RequiredLabel>
            <Input
              name="name"
              value={card.name}
              onChange={handleCardChange}
              required
              placeholder="John Doe"
            />
          </div>
          <div className="md:col-span-2">
            <RequiredLabel>Card Number</RequiredLabel>
            <Input
              name="number"
              value={card.number}
              onChange={handleCardChange}
              required
              maxLength={19}
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div>
            <RequiredLabel>Expiry</RequiredLabel>
            <Input
              name="expiry"
              value={card.expiry}
              onChange={handleCardChange}
              required
              maxLength={5}
              placeholder="MM/YY"
            />
          </div>
          <div>
            <RequiredLabel>CVC</RequiredLabel>
            <Input
              name="cvc"
              value={card.cvc}
              onChange={handleCardChange}
              required
              maxLength={4}
              placeholder="123"
            />
          </div>
         
        </div>
      )}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="pt-6">
        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={previousStep}
            className="sm:w-auto w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="sm:w-auto w-full"
            onClick={handleNext}  
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
    
  );
};
