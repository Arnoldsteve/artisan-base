import Decimal from "decimal.js";
import { formatCurrency } from "./format-currency";
import { Currency } from "@/types/currency";

interface FormatOptions {
  showSymbol?: boolean;
  precision?: number;
}

/**
 * Enterprise Money Formatter
 * Supports Decimal.js, thousand separators, and optional currency symbols.
 */
export function formatMoney(
  amount: number | string | Decimal, 
  currency: Currency = Currency.KES,
  options: FormatOptions = { showSymbol: true, precision: 2 }
) {
  const { showSymbol = true, precision = 2 } = options;
  
  // Convert Decimal.js or string to number safely
  const value = amount instanceof Decimal ? amount.toNumber() : Number(amount) || 0;

  // 1. Logic for "Clean Numbers" (No Symbol)
  if (!showSymbol) {
    return value.toLocaleString("en-KE", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
  }

  // 2. Logic for Standard Display (With Symbol)
  if (currency === Currency.KES) {
    return `Ksh ${value.toLocaleString("en-KE", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })}`;
  }

  return formatCurrency(value, currency);
}