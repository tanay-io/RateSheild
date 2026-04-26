import {
  ApiKeyListResponse,
  AuthResponse,
  CheckLogEntry,
  DashboardSnapshot,
  Rule,
  StatsResponse
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

type JsonMethod = "GET" | "POST" | "DELETE";

async function request<T>(
  pathname: string,
  init?: {
    method?: JsonMethod;
    token?: string;
    body?: unknown;
  }
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${pathname}`, {
    method: init?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init?.token ? { Authorization: `Bearer ${init.token}` } : {})
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return (await response.json()) as T;
}

async function requestText(
  pathname: string,
  init?: {
    method?: JsonMethod;
    apiKey?: string;
    body?: unknown;
  }
) {
  const response = await fetch(`${API_BASE_URL}${pathname}`, {
    method: init?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init?.apiKey ? { "X-API-Key": init.apiKey } : {})
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store"
  });

  return {
    status: response.status,
    body: await response.text()
  };
}

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Health check failed");
  }
  return response.text();
}

export async function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password }
  });
}

export async function register(name: string, email: string, password: string) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: { name, email, password }
  });
}

export async function loadDashboard(token: string): Promise<DashboardSnapshot> {
  const [stats, logs, keys, rules] = await Promise.all([
    getStats(token),
    getLogs(token),
    listApiKeys(token),
    listRules(token)
  ]);

  return {
    stats,
    logs,
    keys: keys.keys,
    rules
  };
}

export async function getStats(token: string) {
  return request<StatsResponse>("/dashboard/stats", { token });
}

export async function getLogs(token: string, limit?: number) {
  const query = limit ? `?limit=${limit}` : "";
  return request<CheckLogEntry[]>(`/dashboard/logs${query}`, { token });
}

export async function listApiKeys(token: string) {
  return request<ApiKeyListResponse>("/dashboard/apikeys", { token });
}

export async function listRules(token: string) {
  return request<Rule[]>("/dashboard/rules", { token });
}

export async function createApiKey(token: string, name: string) {
  return request<{ key: string }>("/dashboard/apikeys", {
    method: "POST",
    token,
    body: { name }
  });
}

export async function revokeApiKey(token: string, keyId: number) {
  return request<{ message: string }>(`/dashboard/apikeys/${keyId}`, {
    method: "DELETE",
    token
  });
}

export async function createRule(
  token: string,
  input: {
    routePattern: string;
    algo: string;
    limit: number;
    window: number;
    keyBy: string;
  }
) {
  return request<Rule>("/dashboard/rules", {
    method: "POST",
    token,
    body: input
  });
}

export async function deleteRule(token: string, ruleId: number) {
  return request<{ message: string }>(`/dashboard/rules/${ruleId}`, {
    method: "DELETE",
    token
  });
}

export async function checkRateLimit(input: {
  apiKey: string;
  key: string;
  algo: string;
  window: number;
  limit: number;
}) {
  return requestText("/check", {
    method: "POST",
    apiKey: input.apiKey,
    body: {
      key: input.key,
      algo: input.algo,
      window: input.window,
      limit: input.limit
    }
  });
}
