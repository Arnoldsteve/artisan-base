import { Address } from "../types/address";

export function validateAddress(address: Address): string | null {
  if (
    !address.street ||
    !address.city ||
    !address.state ||
    !address.zipCode ||
    !address.country
  ) {
    return "Please fill in all required fields.";
  }
  // Add more validation as needed (e.g., zip code format)
  return null;
}
