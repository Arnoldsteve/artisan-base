// src/lib/money.ts
import { formatCurrency } from "./format-currency";
import type { Currency } from "@/types/currency";

export function formatMoney(amount: number, currency: Currency = "KES") {
   if (currency === "KES") {
    return `Ksh ${amount.toLocaleString("en-KE")}`;
  }
  return formatCurrency(amount, currency);
}
