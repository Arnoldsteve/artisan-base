// src/components/checkout/shipping-address-step.tsx
"use client";

import React, { useState } from "react";
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
import { countries } from "@/data/countries";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/ui/command";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { RequiredLabel } from "../RequiredLabel";

export const ShippingAddressStep: React.FC = () => {
  const { shippingAddress, setShippingAddress, nextStep, previousStep } =
    useCheckoutContext();

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: shippingAddress?.street || "",
      city: shippingAddress?.city || "",
      region: shippingAddress?.region || "",
      zipCode: shippingAddress?.zipCode || "",
      country: shippingAddress?.country || "KE",
    },
  });

  const onSubmit = (data: AddressSchema) => {
    setShippingAddress(data);
    nextStep();
  };

  const country = watch("country");

const regionLabel =
  country === "US"
    ? "State"
    : country === "CA"
    ? "Province"
    : country === "GB"
    ? "County"
    : "Region";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Street */}
        <div className="md:col-span-2">
          <RequiredLabel>Street Address</RequiredLabel>
          <Input {...register("street")} />
          {errors.street && (
            <p className="text-red-500 text-sm">{errors.street.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <RequiredLabel>City</RequiredLabel>
          <Input {...register("city")} />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        {/* Region */}
        <div>
          <RequiredLabel>{regionLabel}</RequiredLabel>
          <Input {...register("region")} />
          {errors.region && (
            <p className="text-red-500 text-sm">{errors.region.message}</p>
          )}
        </div>


        {/* ZIP Code */}
        <div>
          <RequiredLabel>ZIP Code</RequiredLabel>
          <Input {...register("zipCode")} />
          {errors.zipCode && (
            <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <RequiredLabel>Country</RequiredLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {countries.find((c) => c.code === watch("country"))?.name ||
                  "Select country"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-full min-w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList className="max-h-64 overflow-y-auto">
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((c) => (
                      <CommandItem
                        key={c.code}
                        value={c.name}
                        onSelect={() => {
                          setValue("country", c.code, { shouldValidate: true });
                          setOpen(false); // ✅ close after select
                        }}
                      >
                        <span className="mr-2">{c.flag}</span>
                        {c.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            watch("country") === c.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>
      </div>

      <ShippingOptionsStep />

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
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};