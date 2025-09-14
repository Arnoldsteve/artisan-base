import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerSchema,
  CustomerSchema,
} from "@/validation-schemas/customer-schema";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { RequiredLabel } from "../RequiredLabel";
import { countries } from "@/data/countries";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@repo/ui/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/ui/command";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

import { useCheckoutContext } from "@/contexts/checkout-context";

export const CustomerInfoStep: React.FC = () => {
  const { customer, setCustomer, nextStep } = useCheckoutContext();
  const [open, setOpen] = useState(false);

  // Local state for selected country dial code (default Kenya +254)
  const [selectedCode, setSelectedCode] = useState<string>(
    customer?.phone?.startsWith("+")
      ? customer.phone.match(/^\+\d+/)?.[0] || "+254"
      : "+254"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      // strip dial code if present in saved phone
      phone: customer?.phone?.replace(/^\+\d+/, "") || "",
    },
  });

  const onSubmit = (data: CustomerSchema) => {
    const fullPhone = `${selectedCode}${data.phone}`.replace(/\s+/g, "");

    setCustomer({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: fullPhone, // ✅ Only phone sent to backend
    });

    nextStep();
  };

  const selectedCountry = countries.find((c) => c.dialCode === selectedCode);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Customer Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <RequiredLabel>First Name</RequiredLabel>
          <Input {...register("firstName")} />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <RequiredLabel>Last Name</RequiredLabel>
          <Input {...register("lastName")} />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <RequiredLabel>Email</RequiredLabel>
          <Input type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="md:col-span-2">
          <Label className="block text-sm font-medium mb-2">Phone</Label>
          <div className="flex gap-2">
            {/* Country Code Selector */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[140px] justify-between"
                >
                  {selectedCountry?.flag} {selectedCountry?.dialCode}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList className="max-h-64 overflow-y-auto">
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((c) => (
                        <CommandItem
                          key={c.code}
                          value={`${c.name} ${c.dialCode} ${c.code}`}
                          onSelect={() => {
                            setSelectedCode(c.dialCode);
                            setOpen(false);
                          }}
                        >
                          <span className="mr-2">{c.flag}</span>
                          {c.name} ({c.dialCode})
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4 transition-colors",
                              selectedCode === c.dialCode
                                ? "text-blue-600 opacity-100"
                                : "text-gray-300 opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Phone Number Input */}
            <Input
              type="tel"
              {...register("phone")}
              placeholder="712 345 678"
              className="flex-1"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button type="submit" className="sm:w-auto w-full">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
