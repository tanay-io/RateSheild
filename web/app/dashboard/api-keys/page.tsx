"use client";

import { Copy, Plus } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/button";
import { StatusBadge } from "@/components/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useToast } from "@/components/toast";
import { api } from "@/lib/api";
import type { ApiKey } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

export default function ApiKeysPage() {
  const toast = useToast();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirming, setConfirming] = useState<number | null>(null);

  const load = useCallback(async () => {
    const response = await api.keys();
    setKeys(response.keys ?? []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    api.keys()
      .then((response) => {
        if (!cancelled) setKeys(response.keys ?? []);
      })
      .catch((err) => {
        if (!cancelled) toast.push({ type: "error", title: "Could not load API keys", detail: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;
    setCreating(true);
    try {
      const response = await api.createKey(name);
      setNewKey(response.key);
      toast.push({ type: "success", title: "API key created", detail: "Copy it now. The full key is shown only once." });
      event.currentTarget.reset();
      await load();
    } catch (err) {
      toast.push({ type: "error", title: "Could not create key", detail: err instanceof Error ? err.message : undefined });
    } finally {
      setCreating(false);
    }
  };

  const revoke = async (id: number) => {
    try {
      await api.revokeKey(id);
      toast.push({ type: "success", title: "API key revoked" });
      setConfirming(null);
      await load();
    } catch (err) {
      toast.push({ type: "error", title: "Could not revoke key", detail: err instanceof Error ? err.message : undefined });
    }
  };

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.push({ type: "success", title: "Copied" });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-medium">API Keys</h1>
          <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] text-white/50">{keys.length} keys</span>
        </div>
        <form onSubmit={create} className="flex gap-2">
          <input name="name" placeholder="Key name" className="h-9 rounded-md border border-white/10 bg-transparent px-3 text-[13px] outline-none transition focus:border-white/25" />
          <Button isLoading={creating} className="h-9">
            <Plus className="h-3.5 w-3.5" /> Create key
          </Button>
        </form>
      </div>
      {newKey ? (
        <div className="rounded-lg border border-green/20 bg-green/10 p-4">
          <div className="text-[13px] font-medium text-green">New key</div>
          <div className="mt-2 flex gap-2">
            <code className="min-w-0 flex-1 overflow-auto rounded-md bg-black/30 px-3 py-2 font-mono text-xs text-white">{newKey}</code>
            <Button onClick={() => copy(newKey)}><Copy className="h-3.5 w-3.5" /> Copy</Button>
          </div>
        </div>
      ) : null}
      {keys.length === 0 ? (
        <EmptyState title="No API keys yet" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-surface">
          <div className="grid h-10 min-w-[760px] grid-cols-[2fr_2fr_1.5fr_1fr_1.2fr] items-center border-b border-white/[0.06] px-5 text-[11px] font-medium uppercase tracking-[0.05em] text-white/30">
            <div>Name</div><div>Key prefix</div><div>Created</div><div>Status</div><div>Actions</div>
          </div>
          <div className="overflow-x-auto">
            {keys.map((key) => (
              <div key={key.id} className="grid h-[52px] min-w-[760px] grid-cols-[2fr_2fr_1.5fr_1fr_1.2fr] items-center border-b border-white/[0.04] px-5 text-sm transition hover:bg-white/[0.02] last:border-0">
                <div className="font-medium">{key.name}</div>
                <div className="font-mono text-xs text-white/60">{key.prefix}...</div>
                <div className="text-xs text-white/40">{formatRelativeTime(key.createdAt)}</div>
                <div><StatusBadge allowed={!key.revoked} label={key.revoked ? "revoked" : "active"} /></div>
                <div>
                  {confirming === key.id ? (
                    <span className="text-[13px] text-white/45">Are you sure? <button onClick={() => revoke(key.id)} className="text-red">Revoke</button> / <button onClick={() => setConfirming(null)} className="text-white/60">Cancel</button></span>
                  ) : (
                    <button disabled={key.revoked} onClick={() => setConfirming(key.id)} className="text-[13px] text-red transition hover:opacity-70 disabled:text-white/25">Revoke</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
