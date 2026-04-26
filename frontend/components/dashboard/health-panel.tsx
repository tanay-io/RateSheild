"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getHealth } from "@/lib/api/client";

export function HealthPanel() {
  const [status, setStatus] = useState<"loading" | "healthy" | "unhealthy">("loading");

  useEffect(() => {
    void getHealth()
      .then((value) => setStatus(value === "healthy" ? "healthy" : "unhealthy"))
      .catch(() => setStatus("unhealthy"));
  }, []);

  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900">
      <CardContent className="flex items-center justify-between py-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
            Service Health
          </p>
          <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
            Backend heartbeat from <span className="font-mono text-xs">GET /health</span>
          </p>
        </div>
        <Badge tone={status === "healthy" ? "success" : status === "unhealthy" ? "danger" : "neutral"}>
          {status}
        </Badge>
      </CardContent>
    </Card>
  );
}
