import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  region: z.string().optional(), // could be state/province/county
  zipCode: z.string().min(1, "ZIP Code is required"),
  country: z.string().min(1, "Country is required"),
}).refine(
  (data) => {
    if (["US", "CA", "AU"].includes(data.country)) {
      return !!data.region;
    }
    return true;
  },
  {
    message: "Region/State/Province is required for this country",
    path: ["region"],
  }
);

export type AddressSchema = z.infer<typeof addressSchema>;
