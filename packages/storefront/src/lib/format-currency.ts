// src/lib/format-currency.ts
import type { Currency } from "@/types/currency";

export function formatCurrency(
  amount: number,
  currency: Currency,
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
