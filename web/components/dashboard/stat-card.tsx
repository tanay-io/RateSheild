"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { compactNumber, cn } from "@/lib/utils";

export function StatCard({ label, value, subtext, tone = "white" }: { label: string; value: number; subtext: string; tone?: "white" | "green" | "red" }) {
  const display = useCountUp(value);
  return (
    <div className="rounded-lg border border-white/[0.06] bg-surface p-5">
      <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.06em] text-white/40">{label}</div>
      <div className={cn("text-[32px] font-medium leading-none", tone === "green" && "text-green", tone === "red" && "text-red")}>{compactNumber(display)}</div>
      <div className="mt-1.5 text-xs text-white/35">{subtext}</div>
    </div>
  );
}
