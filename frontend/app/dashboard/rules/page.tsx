"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { RulesTable } from "@/components/dashboard/rules-table";
import { SectionCard } from "@/components/dashboard/section-card";
import { useSession } from "@/components/dashboard/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRule, deleteRule, listRules } from "@/lib/api/client";
import { Rule } from "@/lib/types";

export default function RulesPage() {
  const { token } = useSession();
  const [rules, setRules] = useState<Rule[]>([]);
  const [routePattern, setRoutePattern] = useState("");
  const [algo, setAlgo] = useState("sliding");
  const [limit, setLimit] = useState("100");
  const [windowValue, setWindowValue] = useState("60");
  const [keyBy, setKeyBy] = useState("ip");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refresh() {
    if (!token) {
      return;
    }
    setRules(await listRules(token));
  }

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      return;
    }

    void listRules(token)
      .then((nextRules) => {
        if (!cancelled) {
          setRules(nextRules);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [token]);

  function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      if (!token) {
        return;
      }
      try {
        await createRule(token, {
          routePattern,
          algo,
          limit: Number(limit),
          window: Number(windowValue),
          keyBy
        });
        setRoutePattern("");
        setError("");
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create rule");
      }
    });
  }

  function onDelete(id: number) {
    startTransition(async () => {
      if (!token) {
        return;
      }
      try {
        await deleteRule(token, id);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete rule");
      }
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        label="Rules"
        title="Route-level rate limit policy"
        description="Create and remove dashboard rules against /dashboard/rules."
        action={
          <form className="flex flex-wrap items-center gap-2" onSubmit={onCreate}>
            <Input
              placeholder="/api/payments"
              value={routePattern}
              onChange={(event) => setRoutePattern(event.target.value)}
              className="w-44"
            />
            <Input
              placeholder="sliding"
              value={algo}
              onChange={(event) => setAlgo(event.target.value)}
              className="w-28 font-mono text-xs"
            />
            <Input
              placeholder="100"
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
              className="w-20"
            />
            <Input
              placeholder="60"
              value={windowValue}
              onChange={(event) => setWindowValue(event.target.value)}
              className="w-20"
            />
            <Input
              placeholder="ip"
              value={keyBy}
              onChange={(event) => setKeyBy(event.target.value)}
              className="w-20 font-mono text-xs"
            />
            <Button type="submit" disabled={isPending}>
              Add Rule
            </Button>
          </form>
        }
      />
      {error ? <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p> : null}
      <SectionCard eyebrow="Rules" title="Current policy set">
        <RulesTable rules={rules} onDelete={(id) => void onDelete(id)} />
      </SectionCard>
    </div>
  );
}
