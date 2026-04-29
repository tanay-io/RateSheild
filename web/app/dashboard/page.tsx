"use client";

import { LiveEvents } from "@/components/dashboard/live-events";
import { RequestChart } from "@/components/dashboard/request-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { useLiveFeedContext } from "@/components/dashboard/live-feed-provider";

export default function DashboardPage() {
  const { stats, events, chart } = useLiveFeedContext();
  const allowedPct = stats.total_requests ? ((stats.allowed_count / stats.total_requests) * 100).toFixed(1) : "0.0";
  const blockedPct = stats.total_requests ? ((stats.blocked_count / stats.total_requests) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-5">
      <div className="grid gap-3 lg:grid-cols-4">
        <StatCard label="Total Requests" value={stats.total_requests} subtext="all time" />
        <StatCard label="Allowed" value={stats.allowed_count} subtext={`${allowedPct}% of total`} tone="green" />
        <StatCard label="Blocked" value={stats.blocked_count} subtext={`${blockedPct}% of total`} tone="red" />
        <StatCard label="Active Keys" value={stats.active_keys} subtext="API keys in use" />
      </div>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">
        <RequestChart data={chart} />
        <LiveEvents events={events} />
      </div>
    </div>
  );
}
