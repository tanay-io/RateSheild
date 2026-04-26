import { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell eyebrow="Dashboard" title="RateShield Operations">
      {children}
    </DashboardShell>
  );
}
