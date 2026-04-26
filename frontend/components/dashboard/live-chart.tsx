"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { CheckLogEntry } from "@/lib/types";

type LiveChartProps = {
  logs: CheckLogEntry[];
};

type Point = {
  label: string;
  allowed: number;
  blocked: number;
};

function buildSeries(logs: CheckLogEntry[]): Point[] {
  const bucket = new Map<string, Point>();

  logs.forEach((entry) => {
    const date = new Date(entry.timestamp);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const label = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const point = bucket.get(label) ?? { label, allowed: 0, blocked: 0 };
    if (entry.allowed) {
      point.allowed += 1;
    } else {
      point.blocked += 1;
    }
    bucket.set(label, point);
  });

  return Array.from(bucket.values()).slice(-12);
}

export function LiveChart({ logs }: LiveChartProps) {
  const data = buildSeries(logs);

  return (
    <div className="h-[260px] px-2 py-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.06} vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "currentColor" }}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              borderRadius: 0,
              border: "1px solid #27272a",
              background: "#111111",
              color: "#fafafa",
              fontSize: "12px"
            }}
          />
          <Area
            type="monotone"
            dataKey="allowed"
            stroke="#16a34a"
            fill="#16a34a"
            fillOpacity={0.12}
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="blocked"
            stroke="#dc2626"
            fill="#dc2626"
            fillOpacity={0.1}
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
