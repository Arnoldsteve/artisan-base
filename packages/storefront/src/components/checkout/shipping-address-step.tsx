// src/components/checkout/shipping-address-step.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressSchema,
  AddressSchema,
} from "@/validation-schemas/address-schema";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { ShippingOptionsStep } from "./shipping-options-step";

export const ShippingAddressStep: React.FC = () => {
  const { shippingAddress, setShippingAddress, nextStep, previousStep } =
    useCheckoutContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: shippingAddress?.street || "",
      city: shippingAddress?.city || "",
      region: shippingAddress?.region || "", // ✅ using region instead of state
      zipCode: shippingAddress?.zipCode || "",
      country: shippingAddress?.country || "KE",
    },
  });

  const onSubmit = (data: AddressSchema) => {
    setShippingAddress(data);
    nextStep(); // proceed to shipping options step
  };

  const country = watch("country");

  const regionLabel =
    country === "US"
      ? "State *"
      : country === "CA"
      ? "Province *"
      : country === "GB"
      ? "County *"
      : "Region *";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Street */}
        <div className="md:col-span-2">
          <Label className="mb-2 block">Street Address *</Label>
          <Input {...register("street")} />
          {errors.street && (
            <p className="text-red-500 text-sm">{errors.street.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <Label className="mb-2 block">City *</Label>
          <Input {...register("city")} />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        {/* Region (State/Province/County) */}
        <div>
          <Label className="mb-2 block">{regionLabel}</Label>
          <Input {...register("region")} />
          {errors.region && (
            <p className="text-red-500 text-sm">{errors.region.message}</p>
          )}
        </div>

        {/* ZIP Code */}
        <div>
          <Label className="mb-2 block">ZIP Code *</Label>
          <Input {...register("zipCode")} />
          {errors.zipCode && (
            <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <Label className="mb-2 block">Country *</Label>
          <Input {...register("country")} />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>
      </div>

      <ShippingOptionsStep />

      <div className="flex justify-between pt-4">
        <Button variant="outline" type="button" onClick={previousStep}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};
