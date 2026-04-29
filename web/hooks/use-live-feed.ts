"use client";

import { useEffect, useMemo, useState } from "react";
import { API_URL, api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { CheckLogEntry, StatsResponse } from "@/lib/types";

export type RequestVolumePoint = { time: string; allowed: number; blocked: number };
export type LiveFeedState = {
  connected: boolean;
  stats: StatsResponse;
  events: CheckLogEntry[];
  chart: RequestVolumePoint[];
};

export function useLiveFeed(): LiveFeedState {
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<StatsResponse>({ total_requests: 0, allowed_count: 0, blocked_count: 0, active_keys: 0 });
  const [events, setEvents] = useState<CheckLogEntry[]>([]);
  const [chart, setChart] = useState<RequestVolumePoint[]>([]);

  useEffect(() => {
    let disposed = false;
    const load = async () => {
      try {
        const [nextStats, logs] = await Promise.all([api.stats(), api.logs(50)]);
        if (!disposed) {
          setStats(nextStats);
          setEvents(logs);
          setChart(buildChartFromLogs(logs));
        }
      } catch {
        if (!disposed) {
          setStats({ total_requests: 0, allowed_count: 0, blocked_count: 0, active_keys: 0 });
          setEvents([]);
          setChart([]);
        }
      }
    };
    load();
    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let socket: WebSocket | null = null;
    let reconnectTimer = 0;
    let disposed = false;
    let reconnectDelay = 1500;

    const connect = () => {
      socket = new WebSocket(`${API_URL.replace(/^http/, "ws")}/dashboard/live?token=${encodeURIComponent(token)}`);
      socket.onopen = () => {
        reconnectDelay = 1500;
        setConnected(true);
      };
      socket.onclose = () => {
        setConnected(false);
        if (!disposed) {
          reconnectTimer = window.setTimeout(connect, reconnectDelay);
          reconnectDelay = Math.min(reconnectDelay * 1.6, 10000);
        }
      };
      socket.onerror = () => setConnected(false);
      socket.onmessage = (message) => {
        try {
          const event = JSON.parse(message.data) as CheckLogEntry;
          setEvents((items) => [event, ...items].slice(0, 50));
          setStats((current) => ({
            total_requests: current.total_requests + 1,
            allowed_count: current.allowed_count + (event.allowed ? 1 : 0),
            blocked_count: current.blocked_count + (event.allowed ? 0 : 1),
            active_keys: current.active_keys
          }));
          setChart((items) => appendChart(items, event));
        } catch {
          // Ignore malformed websocket payloads.
        }
      };
    };

    connect();

    return () => {
      disposed = true;
      window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);

  return useMemo(() => ({ connected, stats, events, chart }), [connected, stats, events, chart]);
}

function buildChartFromLogs(logs: CheckLogEntry[]) {
  const buckets = new Map<string, RequestVolumePoint>();
  logs
    .slice()
    .reverse()
    .forEach((entry) => {
      const time = minuteLabel(entry.timestamp);
      const current = buckets.get(time) ?? { time, allowed: 0, blocked: 0 };
      if (entry.allowed) current.allowed += 1;
      else current.blocked += 1;
      buckets.set(time, current);
    });
  return Array.from(buckets.values()).slice(-18);
}

function appendChart(items: RequestVolumePoint[], event: CheckLogEntry) {
  const time = minuteLabel(event.timestamp);
  const last = items[items.length - 1];
  if (last?.time === time) {
    return [
      ...items.slice(0, -1),
      {
        ...last,
        allowed: last.allowed + (event.allowed ? 1 : 0),
        blocked: last.blocked + (event.allowed ? 0 : 1)
      }
    ];
  }
  return [...items.slice(-17), { time, allowed: event.allowed ? 1 : 0, blocked: event.allowed ? 0 : 1 }];
}

function minuteLabel(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
