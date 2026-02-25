/**
 * TOP 1% LOGIC: Defensive Currency Formatter
 * Prevents 'Invalid currency code' crashes by enforcing a fallback.
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  try {
    // Ensure we have a valid-looking string (3 letters)
    const safeCurrency = (currency && currency.length === 3) ? currency.toUpperCase() : "USD";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: safeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Final fallback: just show the number if Intl fails
    console.error(`[Intl Error] Invalid currency: ${currency}`);
    return `${amount.toFixed(2)}`;
  }
}