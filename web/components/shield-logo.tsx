import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShieldLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-primary", className)}>
      <Shield className="h-4 w-4" strokeWidth={1.75} />
      <span className="text-[14px] font-medium">RateShield</span>
    </span>
  );
}
