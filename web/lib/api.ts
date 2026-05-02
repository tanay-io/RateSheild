import { getToken } from "@/lib/auth";
import type { ApiKey, AuthResponse, CheckLogEntry, Rule, StatsResponse } from "@/lib/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://ratesheild.onrender.com";

type ApiError = Error & { status?: number };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const message = await res.text();
    const err: ApiError = new Error(message || `Request failed with ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

export const api = {
  health: () => request<string>("/health"),
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  stats: () => request<StatsResponse>("/dashboard/stats"),
  logs: (limit = 50) => request<CheckLogEntry[]>(`/dashboard/logs?limit=${limit}`),
  keys: () => request<{ keys: ApiKey[] }>("/dashboard/apikeys"),
  createKey: (name: string) =>
    request<{ key: string }>("/dashboard/apikeys", { method: "POST", body: JSON.stringify({ name }) }),
  revokeKey: (id: number) => request<{ message: string }>(`/dashboard/apikeys/${id}`, { method: "DELETE" }),
  rules: () => request<Rule[]>("/dashboard/rules"),
  createRule: (rule: Omit<Rule, "id">) =>
    request<Rule>("/dashboard/rules", { method: "POST", body: JSON.stringify(rule) }),
  updateRule: (id: number, rule: Partial<Rule>) =>
    request<Rule>(`/dashboard/rules/${id}`, { method: "PUT", body: JSON.stringify(rule) }),
  deleteRule: (id: number) => request<{ message: string }>(`/dashboard/rules/${id}`, { method: "DELETE" })
};
