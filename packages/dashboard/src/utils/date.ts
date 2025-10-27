export function formatDate(value: string | Date | null | undefined, locale: string = 'en-GB') {
  if (!value) return '—'; // or return '', depending on your UI
  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return '—'; // invalid date
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}
