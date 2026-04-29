"use client";

import { Plus, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AlgorithmBadge } from "@/components/badge";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useToast } from "@/components/toast";
import { api } from "@/lib/api";
import type { Rule } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function RulesPage() {
  const toast = useToast();
  const [rules, setRules] = useState<Rule[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.rules()
      .then((items) => {
        if (!cancelled) setRules(items);
      })
      .catch((err) => {
        if (!cancelled) toast.push({ type: "error", title: "Could not load rules", detail: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const routePattern = String(form.get("routePattern") ?? "").trim();
    const algo = String(form.get("algo") ?? "sliding") as Rule["algo"];
    const limit = Number(form.get("limit") ?? 0);
    const window = Number(form.get("window") ?? 0);
    const keyBy = String(form.get("keyBy") ?? "ip") as Rule["keyBy"];
    if (!routePattern || !limit || !window) return;
    setSaving(true);
    try {
      const rule = await api.createRule({ routePattern, algo, limit, window, keyBy });
      setRules((items) => [rule, ...items]);
      event.currentTarget.reset();
      toast.push({ type: "success", title: "Rule created" });
    } catch (err) {
      toast.push({ type: "error", title: "Could not save rule", detail: err instanceof Error ? err.message : undefined });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await api.deleteRule(id);
      setRules((items) => items.filter((item) => item.id !== id));
      toast.push({ type: "success", title: "Rule deleted" });
    } catch (err) {
      toast.push({ type: "error", title: "Could not delete rule", detail: err instanceof Error ? err.message : undefined });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] pb-5 lg:flex-row lg:items-center">
        <h1 className="text-base font-medium">Rules</h1>
        <form onSubmit={create} className="grid gap-2 sm:grid-cols-[1.6fr_120px_90px_90px_100px_auto]">
          <input name="routePattern" placeholder="/api/checkout" className="h-9 rounded-md border border-white/10 bg-transparent px-3 font-mono text-[13px] outline-none transition focus:border-white/25" />
          <select name="algo" defaultValue="sliding" className="h-9 rounded-md border border-white/10 bg-page px-3 text-[13px] outline-none">
            <option value="sliding">sliding</option>
            <option value="fixed">fixed</option>
            <option value="token_bucket">token_bucket</option>
          </select>
          <input name="limit" type="number" min="1" placeholder="20" className="h-9 rounded-md border border-white/10 bg-transparent px-3 text-[13px] outline-none" />
          <input name="window" type="number" min="1" placeholder="60" className="h-9 rounded-md border border-white/10 bg-transparent px-3 text-[13px] outline-none" />
          <select name="keyBy" defaultValue="ip" className="h-9 rounded-md border border-white/10 bg-page px-3 text-[13px] outline-none">
            <option value="ip">by ip</option>
            <option value="user">by user</option>
            <option value="api_key">by api key</option>
          </select>
          <Button isLoading={saving} className="h-9"><Plus className="h-3.5 w-3.5" /> New rule</Button>
        </form>
      </div>
      {rules.length === 0 ? <EmptyState title="No rules configured" /> : null}
      <div className="space-y-2">
        {rules.map((rule) => (
          <button
            key={rule.id}
            onClick={() => setSelected(rule.id)}
            className={cn(
              "group relative w-full rounded-lg border border-white/[0.06] bg-surface px-5 py-4 text-left transition duration-150 hover:border-white/[0.12]",
              selected === rule.id && "border-l-2 border-l-white bg-white/[0.03]"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="font-mono text-[13px] text-white">{rule.routePattern}</div>
              <AlgorithmBadge algo={rule.algo} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/40">
              <span className="font-mono">{rule.limit} requests / {rule.window}s</span>
              <span>by {rule.keyBy}</span>
            </div>
            <span onClick={(event) => { event.stopPropagation(); remove(rule.id); }} className="absolute right-3 top-3 hidden text-white/40 transition hover:text-red group-hover:inline-flex">
              <X className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
