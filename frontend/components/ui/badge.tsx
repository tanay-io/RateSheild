import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "success" | "danger" | "neutral";
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full border px-2 font-mono text-[11px]",
        tone === "success" &&
          "border-green-200 text-green-700 dark:border-green-950 dark:text-green-400",
        tone === "danger" &&
          "border-red-200 text-red-700 dark:border-red-950 dark:text-red-400",
        tone === "neutral" &&
          "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400",
        className
      )}
      {...props}
    />
  );
}
