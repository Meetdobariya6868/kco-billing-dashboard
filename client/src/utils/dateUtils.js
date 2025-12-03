// accepts date strings like '2025-12-02' or ISO
export function toMonthKey(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2,'0');
  return `${y}-${m}`;
}
export function monthLabel(monthKey) {
  // monthKey 'YYYY-MM' -> 'MMM YYYY'
  const [y,m] = monthKey.split('-');
  const date = new Date(Number(y), Number(m)-1, 1);
  return date.toLocaleString(undefined, { month:'short', year:'numeric' });
}
