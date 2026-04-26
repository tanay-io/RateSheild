"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";

import { KeysTable } from "@/components/dashboard/keys-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionCard } from "@/components/dashboard/section-card";
import { useSession } from "@/components/dashboard/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createApiKey, listApiKeys, revokeApiKey } from "@/lib/api/client";
import { ApiKeyRecord } from "@/lib/types";

export default function ApiKeysPage() {
  const { token } = useSession();
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [name, setName] = useState("");
  const [latestKey, setLatestKey] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refresh() {
    if (!token) {
      return;
    }
    const nextKeys = await listApiKeys(token);
    setKeys(nextKeys.keys);
  }

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      return;
    }

    void listApiKeys(token)
      .then((nextKeys) => {
        if (!cancelled) {
          setKeys(nextKeys.keys);
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
      if (!token || !name) {
        return;
      }
      try {
        const response = await createApiKey(token, name);
        setLatestKey(response.key);
        setName("");
        setError("");
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create API key");
      }
    });
  }

  function onRevoke(id: number) {
    startTransition(async () => {
      if (!token) {
        return;
      }
      try {
        await revokeApiKey(token, id);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to revoke API key");
      }
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        label="API Keys"
        title="Issue and revoke service credentials"
        description="Backed by POST, GET, and DELETE on /dashboard/apikeys."
        action={
          <form className="flex items-center gap-2" onSubmit={onCreate}>
            <Input placeholder="New key name" value={name} onChange={(event) => setName(event.target.value)} />
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </form>
        }
      />
      {error ? <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p> : null}
      {latestKey ? (
        <Card>
          <CardContent className="space-y-2 py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
              Latest raw key
            </p>
            <div className="border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
              {latestKey}
            </div>
          </CardContent>
        </Card>
      ) : null}
      <SectionCard eyebrow="Credentials" title="Stored API key prefixes">
        <KeysTable keys={keys} onRevoke={(id) => void onRevoke(id)} />
      </SectionCard>
    </div>
  );
}
