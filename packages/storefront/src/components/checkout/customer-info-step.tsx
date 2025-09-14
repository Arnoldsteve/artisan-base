import React from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { ArrowRight } from "lucide-react";

export const CustomerInfoStep: React.FC = () => {
  const { customer, setCustomer, nextStep } = useCheckoutContext();

  // Setup form with default values from context
  const {
    register,
    handleSubmit,
    setValue, // ✅ needed for Select
    formState: { errors },
  } = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      countryCode: customer?.countryCode || "+254", // ✅ new
    },
  });

  const onSubmit = (data: CustomerSchema) => {
    setCustomer(data);
    nextStep();
  };

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
            <Select
              defaultValue="+254"
              onValueChange={(value) => {
                setValue("countryCode", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select code" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.dialCode}>
                    <span className="mr-2">{c.flag}</span>
                    {c.name} ({c.dialCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

      <Button
        type="submit"
        className="sm:w-auto w-full"
      >
        Next
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
};
