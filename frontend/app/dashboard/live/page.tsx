"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { SectionCard } from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/components/dashboard/session-provider";
import { CheckLogEntry } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

function websocketURL(token: string) {
  const url = new URL(`${API_BASE_URL}/dashboard/live`);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.searchParams.set("token", token);
  return url.toString();
}

export default function LivePage() {
  const { token } = useSession();
  const [status, setStatus] = useState<"connecting" | "open" | "closed">("connecting");
  const [events, setEvents] = useState<CheckLogEntry[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = new WebSocket(websocketURL(token));
    socket.onopen = () => setStatus("open");
    socket.onclose = () => setStatus("closed");
    socket.onerror = () => setStatus("closed");
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as CheckLogEntry;
        setEvents((current) => [payload, ...current].slice(0, 50));
      } catch {
        return;
      }
    };

    return () => socket.close();
  }, [token]);

  return (
    <div className="space-y-6">
      <PageHeader
        label="Live Feed"
        title="Realtime websocket events"
        description="Connected to GET /dashboard/live with query-token websocket auth for browser compatibility."
        action={<Badge tone={status === "open" ? "success" : status === "closed" ? "danger" : "neutral"}>{status}</Badge>}
      />
      <SectionCard eyebrow="Stream" title="Recent broadcast events">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {events.length === 0 ? (
            <div className="px-4 py-10 text-[13px] text-zinc-500 dark:text-zinc-400">No events received yet.</div>
          ) : (
            events.map((event) => (
              <div key={`${event.timestamp}-${event.key}`} className="grid gap-1 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Badge tone={event.allowed ? "success" : "danger"}>
                    {event.allowed ? "allowed" : "blocked"}
                  </Badge>
                  <span className="font-mono text-xs">{event.algo}</span>
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{event.ip}</span>
                </div>
                <div className="font-mono text-xs">{event.key}</div>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
}
