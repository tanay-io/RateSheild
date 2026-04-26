import { Card, CardContent } from "@/components/ui/card";
import { formatDelta, formatNumber } from "@/lib/format";

type StatCardProps = {
  label: string;
  value: number;
  delta: number;
  tone?: "neutral" | "success" | "danger";
};

export function StatCard({ label, value, delta, tone = "neutral" }: StatCardProps) {
  const deltaClass =
    tone === "success"
      ? "text-green-600 dark:text-green-400"
      : tone === "danger"
        ? "text-red-600 dark:text-red-400"
        : "text-zinc-500 dark:text-zinc-400";

  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900">
      <CardContent className="space-y-2 py-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        <div className="flex items-end justify-between gap-3">
          <span className="text-[30px] font-medium tracking-tight">{formatNumber(value)}</span>
          <span className={`text-[11px] font-medium ${deltaClass}`}>{formatDelta(delta)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
