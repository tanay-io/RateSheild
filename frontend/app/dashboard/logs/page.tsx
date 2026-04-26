"use client";

import { useEffect, useState } from "react";

import { LogsTable } from "@/components/dashboard/logs-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionCard } from "@/components/dashboard/section-card";
import { useSession } from "@/components/dashboard/session-provider";
import { getLogs } from "@/lib/api/client";
import { CheckLogEntry } from "@/lib/types";

export default function LogsPage() {
  const { token } = useSession();
  const [logs, setLogs] = useState<CheckLogEntry[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    void getLogs(token, 100).then(setLogs).catch(() => undefined);
  }, [token]);

  return (
    <div className="space-y-6">
      <PageHeader
        label="Logs"
        title="Recent request decisions"
        description="Reads from GET /dashboard/logs with compact operational density."
      />
      <SectionCard eyebrow="Audit Trail" title="Latest 100 check entries">
        <LogsTable logs={logs} />
      </SectionCard>
    </div>
  );
}
