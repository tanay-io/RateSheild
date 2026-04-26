"use client";

import { FormEvent, useState, useTransition } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { checkRateLimit } from "@/lib/api/client";

export default function CheckPage() {
  const [apiKey, setApiKey] = useState("");
  const [key, setKey] = useState("user:42");
  const [algo, setAlgo] = useState("sliding");
  const [windowValue, setWindowValue] = useState("60");
  const [limit, setLimit] = useState("100");
  const [result, setResult] = useState<{ status: number; body: string } | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const response = await checkRateLimit({
          apiKey,
          key,
          algo,
          window: Number(windowValue),
          limit: Number(limit)
        });
        setResult(response);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Check request failed");
      }
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        label="Check"
        title="Exercise POST /check end to end"
        description="Paste a raw API key and submit live rate-limit checks against the backend."
      />
      <Card>
        <CardContent className="py-4">
          <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
            <Input placeholder="Raw API key" value={apiKey} onChange={(event) => setApiKey(event.target.value)} className="md:col-span-2 font-mono text-xs" />
            <Input placeholder="Key" value={key} onChange={(event) => setKey(event.target.value)} className="font-mono text-xs" />
            <Input placeholder="Algorithm" value={algo} onChange={(event) => setAlgo(event.target.value)} className="font-mono text-xs" />
            <Input placeholder="Window seconds" value={windowValue} onChange={(event) => setWindowValue(event.target.value)} />
            <Input placeholder="Limit" value={limit} onChange={(event) => setLimit(event.target.value)} />
            <div className="md:col-span-2 flex items-center gap-3">
              <Button type="submit" disabled={isPending}>
                Send Check
              </Button>
              {error ? <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p> : null}
            </div>
          </form>
        </CardContent>
      </Card>
      {result ? (
        <Card>
          <CardContent className="space-y-2 py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
              Response
            </p>
            <div className="font-mono text-xs">status: {result.status}</div>
            <div className="border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
              {result.body}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
