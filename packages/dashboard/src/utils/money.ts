import Decimal from "decimal.js";
import { formatCurrency } from "./format-currency";
import { Currency } from "@/types/currency";

interface FormatOptions {
  showSymbol?: boolean;
  precision?: number;
}

export function formatMoney(
  amount: number | string | Decimal, 
  currency: string | null | undefined = Currency.KES, // Accept null/undefined
  options: FormatOptions = { showSymbol: true, precision: 2 }
) {
  const { showSymbol = true, precision = 2 } = options;
  
  // 1. Safe Value Conversion
  const value = amount instanceof Decimal ? amount.toNumber() : Number(amount) || 0;

  // 2. Safe Currency Normalization
  // If currency is null, undefined, or empty, default to KES
  const activeCurrency = (currency && currency.trim() !== "") ? currency : Currency.KES;

  if (!showSymbol) {
    return value.toLocaleString("en-KE", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
  }

  // 3. Optimized KES path
  if (activeCurrency === Currency.KES) {
    return `Ksh ${value.toLocaleString("en-KE", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })}`;
  }

  // 4. Global Path
  return formatCurrency(value, activeCurrency);
}