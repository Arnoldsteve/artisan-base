export function formatDate(dateInput: string | Date, locale = "en-US"): string {
  if (!dateInput) return "";

  // Convert string to Date if needed
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
