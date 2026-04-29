"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, FileText, Key, LogOut, Menu, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ShieldLogo } from "@/components/shield-logo";
import { clearSession, getToken, getUser } from "@/lib/auth";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/toast";
import { LiveFeedProvider, useLiveFeedContext } from "@/components/dashboard/live-feed-provider";

const navGroups = [
  { label: "OVERVIEW", items: [{ href: "/dashboard", icon: BarChart3, label: "Overview" }] },
  {
    label: "MANAGE",
    items: [
      { href: "/dashboard/api-keys", icon: Key, label: "API Keys" },
      { href: "/dashboard/rules", icon: SlidersHorizontal, label: "Rules" }
    ]
  },
  { label: "OBSERVE", items: [{ href: "/dashboard/logs", icon: FileText, label: "Logs" }] }
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/api-keys": "API Keys",
  "/dashboard/rules": "Rules",
  "/dashboard/logs": "Logs"
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <LiveFeedProvider>
        <DashboardFrame>{children}</DashboardFrame>
      </LiveFeedProvider>
    </ToastProvider>
  );
}

function DashboardFrame({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { connected } = useLiveFeedContext();
  const title = pageTitles[pathname] ?? "Dashboard";

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const timer = window.setTimeout(() => setUser(getUser()), 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  const logout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-page text-white">
        <button aria-label="Open navigation" onClick={() => setOpen(true)} className="fixed left-4 top-3 z-50 md:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[220px] flex-col border-r border-white/[0.06] bg-sidebar py-4 transition-transform md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 pb-4">
            <Link href="/dashboard"><ShieldLogo className="[&_span]:text-[13px]" /></Link>
            <button aria-label="Close navigation" onClick={() => setOpen(false)} className="md:hidden"><X className="h-4 w-4" /></button>
          </div>
          <nav className="flex-1">
            {navGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-1 mt-4 px-4 text-[10px] font-medium uppercase tracking-[0.08em] text-white/30">{group.label}</div>
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "relative flex h-9 items-center gap-2 px-4 text-[13px] text-white/50 transition duration-100 hover:bg-white/[0.04] hover:text-white/80",
                        active && "bg-white/[0.06] font-medium text-white after:absolute after:right-0 after:top-0 after:h-full after:w-0.5 after:bg-white"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="border-t border-white/[0.06] px-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[11px] font-medium">
                {getInitials(user)}
              </div>
              <div className="min-w-0 truncate text-xs text-white/50">{user?.email ?? "..."}</div>
            </div>
            <button onClick={logout} className="mt-2 flex items-center gap-2 text-[13px] text-white/40 transition hover:text-red">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </aside>
        <div className="md:pl-[220px]">
          <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-white/[0.06] bg-sidebar px-6">
            <div className="pl-8 text-sm font-medium md:pl-0">{title}</div>
            <div className="flex items-center gap-3">
              <span className={connected ? "inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/10 px-2.5 py-1 text-xs font-medium text-green" : "inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/10 px-2.5 py-1 text-xs font-medium text-amber"}>
                <span className={connected ? "h-1.5 w-1.5 animate-pulseDot rounded-full bg-green" : "h-1.5 w-1.5 animate-pulseDot rounded-full bg-amber"} /> {connected ? "Live" : "Reconnecting"}
              </span>
              <div className="hidden h-7 w-7 place-items-center rounded-full bg-white/10 text-[11px] font-medium sm:grid">
                {getInitials(user)}
              </div>
            </div>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
    </div>
  );
}

function getInitials(user: User | null) {
  return (user?.name ?? user?.email ?? "..").slice(0, 2).toUpperCase();
}
