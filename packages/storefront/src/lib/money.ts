// src/lib/money.ts
import { formatCurrency } from "./format-currency";
import type { Currency } from "@/types/currency";

export function formatMoney(amount: number | string, currency: Currency = "KES") {
  const value = Number(amount) || 0;

  if (currency === "KES") {
    return `Ksh ${value.toLocaleString("en-KE", {
      // minimumFractionDigits: 2,
      // maximumFractionDigits: 2,
    })}`;
  }
  return formatCurrency(value, currency);
}
