"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/button";
import Link from "next/link";

export default function RulesPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06]">
        <SlidersHorizontal className="h-7 w-7 text-white/30" />
      </div>
      <h2 className="mt-6 text-2xl font-bold">Rules are coming soon</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-white/50">
        Route-based rate limiting with per-endpoint configuration is in development.
        For now, use the <code className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-xs">/check</code> API
        with your API key to enforce limits directly in your application.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/dashboard/api-keys">
          <Button variant="primary">Manage API Keys</Button>
        </Link>
        <a href="https://github.com/tanay-io/RateSheild" target="_blank" rel="noopener noreferrer">
          <Button variant="secondary">View Docs</Button>
        </a>
      </div>
    </div>
  );
}
