"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "API Keys", href: "/dashboard/apikeys" },
  { label: "Rules", href: "/dashboard/rules" },
  { label: "Logs", href: "/dashboard/logs" },
  { label: "Check", href: "/dashboard/check" },
  { label: "Live Feed", href: "/dashboard/live" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[220px] shrink-0 border-r border-zinc-200 bg-zinc-100/70 px-4 py-5 dark:border-zinc-800 dark:bg-[#111111] lg:block">
      <div className="mb-8">
        <p className="text-[16px] font-medium tracking-tight">RateShield</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
          Infrastructure Control
        </p>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block border-l px-3 py-2 text-[13px] text-zinc-600 dark:text-zinc-400",
              pathname === item.href
                ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                : "border-transparent"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
