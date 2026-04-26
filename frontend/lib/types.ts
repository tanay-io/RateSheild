export type User = {
  id: number;
  email: string;
  name: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type StatsResponse = {
  total_requests: number;
  allowed_count: number;
  blocked_count: number;
  active_keys: number;
};

export type CheckLogEntry = {
  key: string;
  algo: string;
  allowed: boolean;
  ip: string;
  timestamp: string;
  userId: number;
};

export type ApiKeyRecord = {
  id: number;
  name: string;
  prefix: string;
  revoked: boolean;
  createdAt: string;
};

export type ApiKeyListResponse = {
  keys: ApiKeyRecord[];
};

export type Rule = {
  id: number;
  userId: number;
  routePattern: string;
  algo: string;
  limit: number;
  window: number;
  keyBy: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSnapshot = {
  stats: StatsResponse;
  logs: CheckLogEntry[];
  keys: ApiKeyRecord[];
  rules: Rule[];
};
