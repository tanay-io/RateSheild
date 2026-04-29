import { cn } from "@/lib/utils";

const algoStyles: Record<string, string> = {
  sliding: "border-blue/70 text-blue",
  token_bucket: "border-amber/70 text-amber",
  fixed: "border-white/30 text-white/60"
};

export function AlgorithmBadge({ algo }: { algo: string }) {
  return (
    <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[11px]", algoStyles[algo] ?? algoStyles.fixed)}>
      {algo}
    </span>
  );
}

export function StatusBadge({ allowed, label }: { allowed: boolean; label?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        allowed ? "border-green/20 bg-green/10 text-green" : "border-red/20 bg-red/10 text-red"
      )}
    >
      {label ?? (allowed ? "allowed" : "blocked")}
    </span>
  );
}
