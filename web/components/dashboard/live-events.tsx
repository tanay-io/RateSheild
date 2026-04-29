"use client";

import { motion } from "framer-motion";
import { AlgorithmBadge, StatusBadge } from "@/components/badge";
import type { CheckLogEntry } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

export function LiveEvents({ events }: { events: CheckLogEntry[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/[0.06] bg-surface">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-4">
        <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-green" />
        <h2 className="text-[13px] font-medium">Live events</h2>
      </div>
      <div>
        {events.slice(0, 8).map((event, index) => (
          <motion.div
            key={`${event.timestamp}-${event.key}-${index}`}
            initial={{ opacity: 0, y: -44 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-11 items-center justify-between border-b border-white/[0.04] px-5 last:border-0"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className={event.allowed ? "h-1.5 w-1.5 rounded-full bg-green" : "h-1.5 w-1.5 rounded-full bg-red"} />
              <span className="truncate font-mono text-xs text-white">{event.key}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlgorithmBadge algo={event.algo} />
              <span className="hidden text-[11px] text-white/35 sm:inline">{formatRelativeTime(event.timestamp)}</span>
            </div>
          </motion.div>
        ))}
        {events.length === 0 ? <div className="px-5 py-10 text-center text-sm text-white/35">No live checks yet</div> : null}
      </div>
    </section>
  );
}
