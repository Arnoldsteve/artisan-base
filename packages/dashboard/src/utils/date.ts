export function formatDate(
  value: string | Date | null | undefined,
  options: { locale?: string; includeTime?: boolean } = {}
) {
  if (!value) return "—";

  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "—";

  const { locale = "en-GB", includeTime = false } = options;

  const formatOptions: Intl.DateTimeFormatOptions = includeTime
    ? { dateStyle: "medium", timeStyle: "long", hour12: true }
    : { dateStyle: "medium" };

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}
