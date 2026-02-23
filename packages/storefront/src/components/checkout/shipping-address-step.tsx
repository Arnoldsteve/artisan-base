"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { RequiredLabel } from "../RequiredLabel";

/**
 * TOP 1% ARCHITECTURE: Standardized Address Mapping
 * We use addressLine1/2, state, and postalCode to match 
 * global logistics and backend standards.
 */
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
  } = useForm<any>({
    // Note: Ensure your addressSchema is updated to these new keys
    defaultValues: {
      addressLine1: shippingAddress?.addressLine1 || "",
      addressLine2: shippingAddress?.addressLine2 || "",
      city: shippingAddress?.city || "",
      state: shippingAddress?.state || "",
      postalCode: shippingAddress?.postalCode || "",
      country: shippingAddress?.country || "KE",
    },
  });

  const onSubmit = (data: any) => {
    setShippingAddress(data);
    nextStep();
  };

  const selectedCountryCode = watch("country");
  const selectedCountry = countries.find((c) => c.code === selectedCountryCode);

  // Enterprise Standard: Contextual Labeling
  const stateLabel = useMemo(() => {
    switch (selectedCountryCode) {
      case "US": return "State";
      case "CA": return "Province";
      case "GB": return "County";
      case "KE": return "County / Region";
      default: return "Region / State";
    }
  }, [selectedCountryCode]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold tracking-tight">Delivery Address</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* addressLine1 */}
        <div className="md:col-span-2">
          <RequiredLabel>Street Address or P.O. Box</RequiredLabel>
          <Input 
            {...register("addressLine1")} 
            placeholder="e.g. 123 Ngong Road, Marsabit Plaza"
            className="h-11 rounded-sm"
          />
          {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message as string}</p>}
        </div>

        {/* addressLine2 (Optional) */}
        <div className="md:col-span-2">
          <Label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
            Apartment, suite, unit (Optional)
          </Label>
          <Input 
            {...register("addressLine2")} 
            placeholder="e.g. Apartment 4B"
            className="h-11 rounded-sm"
          />
        </div>

        {/* City */}
        <div>
          <RequiredLabel>City / Town</RequiredLabel>
          <Input {...register("city")} placeholder="e.g. Nairobi" className="h-11 rounded-sm" />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message as string}</p>}
        </div>

        {/* State / Region */}
        <div>
          <RequiredLabel>{stateLabel}</RequiredLabel>
          <Input {...register("state")} placeholder="e.g. Nairobi County" className="h-11 rounded-sm" />
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message as string}</p>}
        </div>

        {/* Postal Code */}
        <div>
          <RequiredLabel>Postal / ZIP Code</RequiredLabel>
          <Input {...register("postalCode")} placeholder="e.g. 00100" className="h-11 rounded-sm" />
          {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message as string}</p>}
        </div>

        {/* Country Selector */}
        <div>
          <RequiredLabel>Country</RequiredLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between h-11 rounded-sm border-input font-normal"
              >
                {selectedCountry ? (
                   <span className="flex items-center gap-2">
                     <span>{selectedCountry.flag}</span>
                     {selectedCountry.name}
                   </span>
                ) : "Select Country"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search countries..." />
                <CommandList className="max-h-72">
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((c) => (
                      <CommandItem
                        key={c.code}
                        value={c.name}
                        onSelect={() => {
                          setValue("country", c.code, { shouldValidate: true });
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span>{c.flag}</span>
                        <span className="flex-1">{c.name}</span>
                        <Check className={cn("h-4 w-4 text-blue-600", selectedCountryCode === c.code ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message as string}</p>}
        </div>
      </div>

      {/* Internal Step for Shipping Rates */}
      <div className="pt-4">
        <ShippingOptionsStep />
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t">
        <Button
          variant="ghost"
          type="button"
          onClick={previousStep}
          className="w-full sm:w-auto text-muted-foreground font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Identity
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto min-w-[180px] bg-blue-600 hover:bg-blue-700 h-12 font-bold uppercase tracking-widest"
        >
          Continue to Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};