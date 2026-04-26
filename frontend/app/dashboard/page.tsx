"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { HealthPanel } from "@/components/dashboard/health-panel";
import { LiveChart } from "@/components/dashboard/live-chart";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { useSession } from "@/components/dashboard/session-provider";
import { loadDashboard } from "@/lib/api/client";
import { DashboardSnapshot } from "@/lib/types";

const emptySnapshot: DashboardSnapshot = {
  stats: { total_requests: 0, allowed_count: 0, blocked_count: 0, active_keys: 0 },
  logs: [],
  keys: [],
  rules: []
};

export default function DashboardOverviewPage() {
  const { token } = useSession();
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(emptySnapshot);

  useEffect(() => {
    if (!token) {
      return;
    }
    void loadDashboard(token).then(setSnapshot).catch(() => undefined);
  }, [token]);

  const blockedRatio =
    snapshot.stats.total_requests === 0
      ? 0
      : (snapshot.stats.blocked_count / snapshot.stats.total_requests) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        label="Overview"
        title="System throughput and operator summary"
        description="Top-level counters, backend health, and a compact view of recent traffic."
      />
      <section className="grid gap-3 xl:grid-cols-4">
        <StatCard label="Total Requests" value={snapshot.stats.total_requests} delta={4.2} />
        <StatCard label="Allowed" value={snapshot.stats.allowed_count} delta={8.4} tone="success" />
        <StatCard label="Blocked" value={snapshot.stats.blocked_count} delta={-1.3} tone="danger" />
        <StatCard label="Active Keys" value={snapshot.stats.active_keys} delta={blockedRatio} />
      </section>
      <HealthPanel />
      <SectionCard eyebrow="Traffic" title="Allowed vs blocked request flow">
        {snapshot.logs.length > 0 ? <LiveChart logs={snapshot.logs} /> : <EmptyState message="No requests yet." />}
      </SectionCard>
    </div>
  );
}
