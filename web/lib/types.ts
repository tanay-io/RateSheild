export type User = {
  id: number;
  email: string;
  name: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApiKey = {
  id: number;
  name: string;
  prefix: string;
  revoked: boolean;
  createdAt: string;
};

export type StatsResponse = {
  total_requests: number;
  allowed_count: number;
  blocked_count: number;
  active_keys: number;
};

export type CheckLogEntry = {
  key: string;
  algo: "fixed" | "sliding" | "token_bucket" | string;
  allowed: boolean;
  ip: string;
  timestamp: string;
  userID: number;
};

export type Rule = {
  id: number;
  userId?: number;
  routePattern: string;
  algo: "fixed" | "sliding" | "token_bucket";
  limit: number;
  window: number;
  keyBy: "ip" | "user" | "api_key" | string;
  createdAt?: string;
  updatedAt?: string;
};
