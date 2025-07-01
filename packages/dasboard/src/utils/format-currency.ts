/**
 * Formats a number as USD currency.
 * @param amount - The amount to format.
 * @returns The formatted currency string.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
