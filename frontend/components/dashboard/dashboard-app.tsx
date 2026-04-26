"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { KeysTable } from "@/components/dashboard/keys-table";
import { LiveChart } from "@/components/dashboard/live-chart";
import { LogsTable } from "@/components/dashboard/logs-table";
import { RulesTable } from "@/components/dashboard/rules-table";
import { SectionCard } from "@/components/dashboard/section-card";
import { Sidebar } from "@/components/dashboard/sidebar";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createApiKey,
  createRule,
  deleteRule,
  loadDashboard,
  login,
  register,
  revokeApiKey
} from "@/lib/api/client";
import { compactKey } from "@/lib/format";
import { DashboardSnapshot } from "@/lib/types";

const emptySnapshot: DashboardSnapshot = {
  stats: {
    total_requests: 0,
    allowed_count: 0,
    blocked_count: 0,
    active_keys: 0
  },
  logs: [],
  keys: [],
  rules: []
};

type AuthMode = "login" | "register";

export function DashboardApp() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return localStorage.getItem("rateshield-token") ?? "";
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyName, setKeyName] = useState("");
  const [ruleRoute, setRuleRoute] = useState("");
  const [ruleAlgo, setRuleAlgo] = useState("sliding");
  const [ruleLimit, setRuleLimit] = useState("100");
  const [ruleWindow, setRuleWindow] = useState("60");
  const [ruleKeyBy, setRuleKeyBy] = useState("ip");
  const [newKeySecret, setNewKeySecret] = useState("");
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(emptySnapshot);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!token) {
      return;
    }

    startTransition(async () => {
      try {
        const data = await loadDashboard(token);
        setSnapshot(data);
        setError("");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load dashboard";
        setError(message);
      }
    });
  }, [token]);

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const response =
          mode === "login"
            ? await login(email, password)
            : await register(name, email, password);
        localStorage.setItem("rateshield-token", response.token);
        setToken(response.token);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    });
  }

  async function refreshDashboard() {
    if (!token) {
      return;
    }
    const data = await loadDashboard(token);
    setSnapshot(data);
  }

  async function handleCreateKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !keyName) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await createApiKey(token, keyName);
        setNewKeySecret(response.key);
        setKeyName("");
        await refreshDashboard();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create API key");
      }
    });
  }

  async function handleRevokeKey(id: number) {
    if (!token) {
      return;
    }

    startTransition(async () => {
      try {
        await revokeApiKey(token, id);
        await refreshDashboard();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to revoke API key");
      }
    });
  }

  async function handleCreateRule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      return;
    }

    startTransition(async () => {
      try {
        await createRule(token, {
          routePattern: ruleRoute,
          algo: ruleAlgo,
          limit: Number(ruleLimit),
          window: Number(ruleWindow),
          keyBy: ruleKeyBy
        });
        setRuleRoute("");
        await refreshDashboard();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create rule");
      }
    });
  }

  async function handleDeleteRule(id: number) {
    if (!token) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteRule(token, id);
        await refreshDashboard();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete rule");
      }
    });
  }

  function handleLogout() {
    localStorage.removeItem("rateshield-token");
    setToken("");
    setSnapshot(emptySnapshot);
    setNewKeySecret("");
  }

  const blockedRatio =
    snapshot.stats.total_requests === 0
      ? 0
      : (snapshot.stats.blocked_count / snapshot.stats.total_requests) * 100;

  const allowedDelta = snapshot.stats.total_requests === 0 ? 0 : 8.4;
  const blockedDelta = snapshot.stats.total_requests === 0 ? 0 : -1.3;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0A]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6">
          <header className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
                Dashboard
              </p>
              <h1 className="mt-1 text-[16px] font-medium">RateShield Operations</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {token ? (
                <>
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {compactKey(token, 16)}
                  </span>
                  <Button variant="ghost" onClick={() => void refreshDashboard()}>
                    Refresh
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                    Clear Session
                  </Button>
                </>
              ) : (
                <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
                  Authenticate with a dashboard JWT to begin.
                </span>
              )}
            </div>
          </header>

          {!token ? (
            <Card className="max-w-md">
              <CardHeader>
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
                  Authentication
                </p>
                <h2 className="mt-1 text-[16px] font-medium">
                  {mode === "login" ? "Sign in to the dashboard" : "Create an operator account"}
                </h2>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={handleAuthSubmit}>
                  {mode === "register" ? (
                    <Input
                      placeholder="Name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  ) : null}
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  {error ? <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p> : null}
                  <div className="flex items-center justify-between">
                    <Button type="submit" disabled={isPending}>
                      {mode === "login" ? "Login" : "Register"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setMode(mode === "login" ? "register" : "login")}
                    >
                      {mode === "login" ? "Need an account?" : "Use existing account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <section className="grid gap-3 xl:grid-cols-4">
                <StatCard label="Total Requests" value={snapshot.stats.total_requests} delta={4.2} />
                <StatCard
                  label="Allowed"
                  value={snapshot.stats.allowed_count}
                  delta={allowedDelta}
                  tone="success"
                />
                <StatCard
                  label="Blocked"
                  value={snapshot.stats.blocked_count}
                  delta={blockedDelta}
                  tone="danger"
                />
                <StatCard
                  label="Active Keys"
                  value={snapshot.stats.active_keys}
                  delta={blockedRatio}
                />
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
                <SectionCard eyebrow="Traffic" title="Allowed vs blocked request flow">
                  {snapshot.logs.length > 0 ? (
                    <LiveChart logs={snapshot.logs} />
                  ) : (
                    <EmptyState message="No requests yet." />
                  )}
                </SectionCard>

                <Card className="h-fit">
                  <CardHeader>
                    <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
                      Session
                    </p>
                    <h2 className="mt-1 text-[16px] font-medium">Operator access token</h2>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
                      {token}
                    </div>
                    {newKeySecret ? (
                      <div>
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
                          Latest raw API key
                        </p>
                        <div className="border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
                          {newKeySecret}
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </section>

              <SectionCard
                eyebrow="API Keys"
                title="Issue and revoke service credentials"
                action={
                  <form className="flex items-center gap-2" onSubmit={handleCreateKey}>
                    <Input
                      placeholder="New key name"
                      value={keyName}
                      onChange={(event) => setKeyName(event.target.value)}
                    />
                    <Button type="submit" disabled={isPending}>
                      Create
                    </Button>
                  </form>
                }
              >
                <KeysTable keys={snapshot.keys} onRevoke={(id) => void handleRevokeKey(id)} />
              </SectionCard>

              <SectionCard
                eyebrow="Rules"
                title="Route-level rate limit policy"
                action={
                  <form className="flex flex-wrap items-center gap-2" onSubmit={handleCreateRule}>
                    <Input
                      placeholder="/api/payments"
                      value={ruleRoute}
                      onChange={(event) => setRuleRoute(event.target.value)}
                      className="w-44"
                    />
                    <Input
                      placeholder="sliding"
                      value={ruleAlgo}
                      onChange={(event) => setRuleAlgo(event.target.value)}
                      className="w-28 font-mono text-xs"
                    />
                    <Input
                      placeholder="100"
                      value={ruleLimit}
                      onChange={(event) => setRuleLimit(event.target.value)}
                      className="w-20"
                    />
                    <Input
                      placeholder="60"
                      value={ruleWindow}
                      onChange={(event) => setRuleWindow(event.target.value)}
                      className="w-20"
                    />
                    <Input
                      placeholder="ip"
                      value={ruleKeyBy}
                      onChange={(event) => setRuleKeyBy(event.target.value)}
                      className="w-20 font-mono text-xs"
                    />
                    <Button type="submit" disabled={isPending}>
                      Add Rule
                    </Button>
                  </form>
                }
              >
                <RulesTable rules={snapshot.rules} onDelete={(id) => void handleDeleteRule(id)} />
              </SectionCard>

              <SectionCard eyebrow="Logs" title="Recent request decisions">
                <LogsTable logs={snapshot.logs} />
              </SectionCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
