export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatDayMonth(iso: string): { day: string; month: string } {
  const date = new Date(`${iso}T00:00:00Z`);
  return {
    day: String(date.getUTCDate()),
    month: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
  };
}
