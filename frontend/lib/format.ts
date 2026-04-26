export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDelta(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function compactKey(value: string, visible = 12) {
  if (value.length <= visible) {
    return value;
  }

  return `${value.slice(0, visible)}...`;
}
