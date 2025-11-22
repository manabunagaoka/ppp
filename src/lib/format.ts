export function formatNumber(value: number | null | undefined, options: Intl.NumberFormatOptions = {}) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", options).format(value);
}

export function formatPercent(value: number | null | undefined, fractionDigits = 0) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

export function describeDataLag(year?: string | null) {
  if (!year) return "unknown";
  return `latest ${year}`;
}
