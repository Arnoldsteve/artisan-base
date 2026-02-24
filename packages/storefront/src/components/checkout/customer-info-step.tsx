"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, CustomerSchema } from "@/validation-schemas/customer-schema";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { countries } from "@/data/countries";
import { Popover, PopoverTrigger, PopoverContent } from "@repo/ui/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@repo/ui/components/ui/command";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { Check, ArrowRight, UserCircle } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { RequiredLabel } from "../RequiredLabel";

export const CustomerInfoStep: React.FC = () => {
  const { customer, setCustomer, nextStep } = useCheckoutContext();
  const [open, setOpen] = useState(false);

  // 1. Identify Dial Code (Default to Kenya +254)
  const [selectedCode, setSelectedCode] = useState<string>(() => {
    if (customer?.phone?.startsWith("+")) {
        return customer.phone.match(/^\+\d+/)?.[0] || "+254";
    }
    return "+254";
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      // Clean input: remove dial code if it exists in the saved string
      phone: customer?.phone ? customer.phone.replace(selectedCode, "") : "",
    },
  });

  /**
   * TOP 1% LOGIC: Phone Number Sanitization
   * millions of users: Prevents double-prefixing and removes national 
   * trunk prefixes (leading zeros) common in African markets.
   */
  const onSubmit = (data: CustomerSchema) => {
    // A. Strip all non-numeric characters from the input
    let cleanLocalNumber = data.phone.replace(/\D/g, "");

    // B. Remove leading zero (e.g., 0712 -> 712) - Standard for +254
    cleanLocalNumber = cleanLocalNumber.replace(/^0+/, "");

    // C. Re-construct International Format
    const fullPhone = `${selectedCode}${cleanLocalNumber}`;

    setCustomer({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: fullPhone,
    });

    nextStep();
  };

  const selectedCountry = countries.find((c) => c.dialCode === selectedCode);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2 mb-2">
        <UserCircle className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold tracking-tight">Contact Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <RequiredLabel>First Name</RequiredLabel>
          <Input {...register("firstName")} placeholder="Steve" className="h-11 rounded-sm" />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message as string}</p>}
        </div>

        <div>
          <RequiredLabel>Last Name</RequiredLabel>
          <Input {...register("lastName")} placeholder="Otieno" className="h-11 rounded-sm" />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message as string}</p>}
        </div>

        <div className="md:col-span-2">
          <RequiredLabel>Email Address</RequiredLabel>
          <Input type="email" {...register("email")} placeholder="steve@example.com" className="h-11 rounded-sm" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
        </div>

        <div className="md:col-span-2">
          <Label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Mobile Phone</Label>
          <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[110px] justify-between h-11 rounded-sm border-input">
                  {selectedCountry?.dialCode}
                  <Check className="h-3 w-3 opacity-30" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search country code..." />
                  <CommandList className="max-h-64">
                    <CommandEmpty>Not found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((c) => (
                        <CommandItem
                          key={c.code}
                          onSelect={() => {
                            setSelectedCode(c.dialCode);
                            setOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">{c.flag}</span>
                          <span className="flex-1">{c.name}</span>
                          <span className="text-muted-foreground">{c.dialCode}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Input
              type="tel"
              {...register("phone")}
              placeholder="712 345 678"
              className="flex-1 h-11 rounded-sm font-mono tracking-wider"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t">
        <Button
          type="submit"
          className="w-full sm:w-auto min-w-[180px] bg-blue-600 hover:bg-blue-700 h-12 font-bold uppercase tracking-widest"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};