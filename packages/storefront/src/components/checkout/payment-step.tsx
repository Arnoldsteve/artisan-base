import React, { useState } from "react";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

const paymentMethods = [
  {
    id: "credit_card",
    type: "credit_card",
    name: "Credit Card",
    icon: "credit-card",
  },
  {
    id: "paypal",
    type: "paypal",
    name: "PayPal",
    icon: "paypal",
  },
];

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
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const method = paymentMethods.find((m) => m.id === selected)!;
    if (method.type === "credit_card") {
      if (!card.number || !card.expiry || !card.cvc || !card.name) {
        setError("Please fill in all credit card fields.");
        return;
      }
    }
    setPaymentMethod(method);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className="flex items-center gap-3 p-3 border rounded cursor-pointer"
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selected === method.id}
              onChange={() => setSelected(method.id)}
              className="accent-primary"
            />
            <span className="flex-1 font-medium">{method.name}</span>
          </label>
        ))}
      </div>
      {selected === "credit_card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Card Number *
            </label>
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
            <label className="block text-sm font-medium mb-2">Expiry *</label>
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
            <label className="block text-sm font-medium mb-2">CVC *</label>
            <Input
              name="cvc"
              value={card.cvc}
              onChange={handleCardChange}
              required
              maxLength={4}
              placeholder="123"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Cardholder Name *
            </label>
            <Input
              name="name"
              value={card.name}
              onChange={handleCardChange}
              required
              placeholder="John Doe"
            />
          </div>
        </div>
      )}
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
