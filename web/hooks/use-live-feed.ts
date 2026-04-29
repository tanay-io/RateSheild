"use client";

import { useEffect, useMemo, useState } from "react";
import { API_URL, api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { CheckLogEntry, StatsResponse } from "@/lib/types";

export function useLiveFeed() {
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<StatsResponse>({ total_requests: 0, allowed_count: 0, blocked_count: 0, active_keys: 0 });
  const [events, setEvents] = useState<CheckLogEntry[]>([]);
  const [chart, setChart] = useState(() => seedChart());

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
        if (!disposed) setChart(seedChart());
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

    const wsUrl = `${API_URL.replace(/^http/, "ws")}/dashboard/live?token=${encodeURIComponent(token)}`;
    const socket = new WebSocket(wsUrl);
    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
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

    return () => socket.close();
  }, []);

  return useMemo(() => ({ connected, stats, events, chart }), [connected, stats, events, chart]);
}

function seedChart() {
  return Array.from({ length: 18 }, (_, i) => ({
    time: `${String((new Date().getHours() + i) % 24).padStart(2, "0")}:00`,
    allowed: Math.floor(120 + Math.random() * 240),
    blocked: Math.floor(10 + Math.random() * 70)
  }));
}

function buildChartFromLogs(logs: CheckLogEntry[]) {
  if (logs.length === 0) return seedChart();
  const recent = logs.slice(0, 18).reverse();
  return recent.map((entry) => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    allowed: entry.allowed ? 1 : 0,
    blocked: entry.allowed ? 0 : 1
  }));
}

function appendChart(items: ReturnType<typeof seedChart>, event: CheckLogEntry) {
  return [
    ...items.slice(-17),
    {
      time: new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      allowed: event.allowed ? 1 : 0,
      blocked: event.allowed ? 0 : 1
    }
  ];
}
