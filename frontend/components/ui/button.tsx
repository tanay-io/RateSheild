import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "destructive";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-none border px-3 text-[13px] font-medium transition-colors",
        variant === "default" &&
          "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900",
        variant === "ghost" &&
          "border-transparent bg-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900",
        variant === "destructive" &&
          "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-950 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60",
        className
      )}
      {...props}
    />
  );
}
