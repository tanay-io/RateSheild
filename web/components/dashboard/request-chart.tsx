"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { RequestVolumePoint } from "@/hooks/use-live-feed";

export function RequestChart({ data }: { data: RequestVolumePoint[] }) {
  return (
    <section className="rounded-lg border border-white/[0.06] bg-surface">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-[13px] font-medium">Request volume</h2>
        <div className="flex gap-4 text-[13px] text-white/35">
          <button className="font-medium text-white">1h</button>
          <button className="transition hover:text-white">6h</button>
          <button className="transition hover:text-white">24h</button>
        </div>
      </div>
      <div className="h-[320px] px-2 pb-5">
        {data.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-white/35">No request volume yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="allowed" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blocked" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="allowed" stroke="#22C55E" strokeWidth={1.5} fill="url(#allowed)" activeDot={{ r: 6, fill: "#fff", stroke: "#22C55E" }} isAnimationActive />
              <Area type="monotone" dataKey="blocked" stroke="#EF4444" strokeWidth={1.5} fill="url(#blocked)" activeDot={{ r: 6, fill: "#fff", stroke: "#EF4444" }} isAnimationActive />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-white/10 bg-[#1f1f1f] px-3 py-2">
      <div className="mb-1 text-[11px] text-white/50">{label}</div>
      {payload.map((item: any) => (
        <div key={item.dataKey} className="flex items-center gap-2 text-xs text-white">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
          {item.dataKey}: {item.value}
        </div>
      ))}
    </div>
  );
}
