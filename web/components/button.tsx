import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  isLoading?: boolean;
  children: ReactNode;
};

export function Button({ className, variant = "secondary", isLoading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-[13px] font-medium transition duration-100 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
        variant === "primary" && "bg-white text-black hover:opacity-90",
        variant === "secondary" && "border border-white/15 bg-transparent text-white hover:bg-white/5",
        variant === "ghost" && "h-auto px-0 text-secondary hover:text-white",
        variant === "danger" && "h-auto px-0 text-red hover:opacity-75",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" /> : null}
      {children}
    </button>
  );
}
