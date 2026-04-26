"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Sidebar } from "@/components/dashboard/sidebar";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/dashboard/session-provider";

type DashboardShellProps = {
  title: string;
  eyebrow: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function DashboardShell({ title, eyebrow, actions, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, token, user, clearSession } = useSession();

  useEffect(() => {
    if (ready && !token) {
      router.replace("/login");
    }
  }, [ready, router, token]);

  if (!ready || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[13px] text-zinc-500 dark:text-zinc-400">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0A]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6">
          <header className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
                {eyebrow}
              </p>
              <h1 className="mt-1 text-[16px] font-medium">{title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {actions}
              <Link
                href={pathname}
                className="font-mono text-xs text-zinc-500 dark:text-zinc-400"
              >
                {user?.email}
              </Link>
              <ThemeToggle />
              <Button variant="ghost" onClick={clearSession}>
                Logout
              </Button>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
