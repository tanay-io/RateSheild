"use client";

import { useMemo, useState } from "react";
import { AlgorithmBadge, StatusBadge } from "@/components/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useLiveFeedContext } from "@/components/dashboard/live-feed-provider";
import { formatRelativeTime } from "@/lib/utils";

export default function LogsPage() {
  const { events } = useLiveFeedContext();
  const [algo, setAlgo] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return events.slice(0, 200).filter((log) => {
      const statusOk = status === "all" || (status === "allowed" ? log.allowed : !log.allowed);
      const algoOk = algo === "all" || log.algo === algo;
      const q = query.toLowerCase();
      const queryOk = !q || log.key.toLowerCase().includes(q) || log.ip.toLowerCase().includes(q);
      return statusOk && algoOk && queryOk;
    });
  }, [events, status, algo, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <select value={algo} onChange={(event) => setAlgo(event.target.value)} className="h-[34px] rounded-md border border-white/10 bg-page px-3 text-[13px] text-white/70 outline-none">
          <option value="all">All algorithms</option>
          <option value="fixed">fixed</option>
          <option value="sliding">sliding</option>
          <option value="token_bucket">token_bucket</option>
        </select>
        <div className="flex h-[34px] overflow-hidden rounded-md border border-white/10">
          {["all", "allowed", "blocked"].map((item) => (
            <button key={item} onClick={() => setStatus(item)} className={status === item ? "bg-white/[0.08] px-3 text-[13px] text-white" : "border-r border-white/10 px-3 text-[13px] text-white/50 last:border-r-0"}>
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
        <select className="h-[34px] rounded-md border border-white/10 bg-page px-3 text-[13px] text-white/70 outline-none">
          <option>Last hour</option>
          <option>Last 24h</option>
          <option>Last 7d</option>
        </select>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search key or IP" className="h-[34px] flex-1 rounded-md border border-white/10 bg-transparent px-3 text-[13px] outline-none transition placeholder:text-white/25 focus:border-white/25" />
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No logs found" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-surface">
          <div className="grid h-10 min-w-[880px] grid-cols-[120px_160px_180px_200px_120px_100px] items-center border-b border-white/[0.06] px-5 text-[11px] font-medium uppercase tracking-[0.05em] text-white/30">
            <div>Time</div><div>Key</div><div>Algorithm</div><div>IP</div><div>Status</div><div>Latency</div>
          </div>
          {filtered.map((log, index) => (
            <div key={`${log.timestamp}-${index}`} className="grid h-11 min-w-[880px] grid-cols-[120px_160px_180px_200px_120px_100px] items-center border-b border-white/[0.04] px-5 transition hover:bg-white/[0.02] last:border-0">
              <div className="font-mono text-xs text-white/40">{formatRelativeTime(log.timestamp)}</div>
              <div className="truncate font-mono text-[13px] font-medium text-white">{log.key}</div>
              <div><AlgorithmBadge algo={log.algo} /></div>
              <div className="font-mono text-xs text-white/50">{log.ip}</div>
              <div><StatusBadge allowed={log.allowed} /></div>
              <div className="font-mono text-xs text-white/40">--</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
