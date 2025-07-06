"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Truck,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface CheckoutForm {
  // Shipping Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Billing Information
  billingSameAsShipping: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingCountry: string;

  // Payment Information
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;

  // Order Summary
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const mockOrderSummary = {
  subtotal: 139.97,
  tax: 11.2,
  shipping: 0, // Free shipping over $100
  total: 151.17,
};

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    billingSameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "US",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
    ...mockOrderSummary,
  });

  const updateFormData = (field: keyof CheckoutForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-fill billing if same as shipping
    if (field === "billingSameAsShipping" && value) {
      setFormData((prev) => ({
        ...prev,
        billingFirstName: prev.firstName,
        billingLastName: prev.lastName,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingState: prev.state,
        billingZipCode: prev.zipCode,
        billingCountry: prev.country,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Shipping
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.address &&
          formData.city &&
          formData.state &&
          formData.zipCode
        );
      case 2: // Billing
        if (formData.billingSameAsShipping) return true;
        return !!(
          formData.billingFirstName &&
          formData.billingLastName &&
          formData.billingAddress &&
          formData.billingCity &&
          formData.billingState &&
          formData.billingZipCode
        );
      case 3: // Payment
        return !!(
          formData.cardNumber &&
          formData.cardExpiry &&
          formData.cardCvc &&
          formData.cardName
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Order placed successfully!");
    router.push("/checkout/success");
  };

  const steps = [
    { id: 1, title: "Shipping", icon: Truck },
    { id: 2, title: "Billing", icon: CreditCard },
    { id: 3, title: "Payment", icon: CreditCard },
    { id: 4, title: "Review", icon: CheckCircle },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <h2 className="text-lg font-semibold text-foreground">
            {steps[currentStep - 1].title} Information
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title} Details</CardTitle>
              <CardDescription>
                {currentStep === 1 && "Enter your shipping information"}
                {currentStep === 2 && "Enter your billing information"}
                {currentStep === 3 && "Enter your payment information"}
                {currentStep === 4 && "Review your order before placing it"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name *
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        updateFormData("firstName", e.target.value)
                      }
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name *
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        updateFormData("lastName", e.target.value)
                      }
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address *
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        updateFormData("address", e.target.value)
                      }
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City *
                    </label>
                    <Input
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      State *
                    </label>
                    <Input
                      value={formData.state}
                      onChange={(e) => updateFormData("state", e.target.value)}
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      ZIP Code *
                    </label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) =>
                        updateFormData("zipCode", e.target.value)
                      }
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Country *
                    </label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        updateFormData("country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Billing Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="billingSame"
                      checked={formData.billingSameAsShipping}
                      onCheckedChange={(checked) =>
                        updateFormData("billingSameAsShipping", checked)
                      }
                    />
                    <label
                      htmlFor="billingSame"
                      className="text-sm font-medium"
                    >
                      Same as shipping address
                    </label>
                  </div>

                  {!formData.billingSameAsShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          First Name *
                        </label>
                        <Input
                          value={formData.billingFirstName}
                          onChange={(e) =>
                            updateFormData("billingFirstName", e.target.value)
                          }
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Last Name *
                        </label>
                        <Input
                          value={formData.billingLastName}
                          onChange={(e) =>
                            updateFormData("billingLastName", e.target.value)
                          }
                          placeholder="Doe"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Address *
                        </label>
                        <Input
                          value={formData.billingAddress}
                          onChange={(e) =>
                            updateFormData("billingAddress", e.target.value)
                          }
                          placeholder="123 Main St"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          City *
                        </label>
                        <Input
                          value={formData.billingCity}
                          onChange={(e) =>
                            updateFormData("billingCity", e.target.value)
                          }
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          State *
                        </label>
                        <Input
                          value={formData.billingState}
                          onChange={(e) =>
                            updateFormData("billingState", e.target.value)
                          }
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          ZIP Code *
                        </label>
                        <Input
                          value={formData.billingZipCode}
                          onChange={(e) =>
                            updateFormData("billingZipCode", e.target.value)
                          }
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Country *
                        </label>
                        <Select
                          value={formData.billingCountry}
                          onValueChange={(value) =>
                            updateFormData("billingCountry", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Card Number *
                    </label>
                    <Input
                      value={formData.cardNumber}
                      onChange={(e) =>
                        updateFormData("cardNumber", e.target.value)
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Expiry Date *
                      </label>
                      <Input
                        value={formData.cardExpiry}
                        onChange={(e) =>
                          updateFormData("cardExpiry", e.target.value)
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        CVC *
                      </label>
                      <Input
                        value={formData.cardCvc}
                        onChange={(e) =>
                          updateFormData("cardCvc", e.target.value)
                        }
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cardholder Name *
                    </label>
                    <Input
                      value={formData.cardName}
                      onChange={(e) =>
                        updateFormData("cardName", e.target.value)
                      }
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      Shipping Information
                    </h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">
                        {formData.firstName} {formData.lastName}
                        <br />
                        {formData.address}
                        <br />
                        {formData.city}, {formData.state} {formData.zipCode}
                        <br />
                        {formData.country}
                      </p>
                    </div>
                  </div>

                  {!formData.billingSameAsShipping && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">
                        Billing Information
                      </h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm">
                          {formData.billingFirstName} {formData.billingLastName}
                          <br />
                          {formData.billingAddress}
                          <br />
                          {formData.billingCity}, {formData.billingState}{" "}
                          {formData.billingZipCode}
                          <br />
                          {formData.billingCountry}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      Payment Method
                    </h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">
                        Card ending in {formData.cardNumber.slice(-4)}
                        <br />
                        {formData.cardName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>

                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="flex items-center space-x-2"
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ${formData.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">
                    ${formData.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {formData.shipping === 0
                      ? "Free"
                      : `$${formData.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-foreground">
                      ${formData.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
