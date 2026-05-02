# Health

Types:

- <code><a href="./src/resources/health.ts">HealthCheckResponse</a></code>

Methods:

- <code title="get /health">client.health.<a href="./src/resources/health.ts">check</a>() -> string</code>

# Auth

Types:

- <code><a href="./src/resources/auth.ts">AuthResponse</a></code>
- <code><a href="./src/resources/auth.ts">UserDto</a></code>

Methods:

- <code title="post /auth/login">client.auth.<a href="./src/resources/auth.ts">login</a>({ ...params }) -> AuthResponse</code>
- <code title="post /auth/register">client.auth.<a href="./src/resources/auth.ts">register</a>({ ...params }) -> AuthResponse</code>

# Dashboard

Types:

- <code><a href="./src/resources/dashboard/dashboard.ts">DashboardGetLogsResponse</a></code>
- <code><a href="./src/resources/dashboard/dashboard.ts">DashboardGetStatsResponse</a></code>

Methods:

- <code title="get /dashboard/logs">client.dashboard.<a href="./src/resources/dashboard/dashboard.ts">getLogs</a>({ ...params }) -> DashboardGetLogsResponse</code>
- <code title="get /dashboard/stats">client.dashboard.<a href="./src/resources/dashboard/dashboard.ts">getStats</a>() -> DashboardGetStatsResponse</code>
- <code title="get /dashboard/live">client.dashboard.<a href="./src/resources/dashboard/dashboard.ts">subscribeLive</a>() -> void</code>

## Apikeys

Types:

- <code><a href="./src/resources/dashboard/apikeys.ts">ApikeyCreateResponse</a></code>
- <code><a href="./src/resources/dashboard/apikeys.ts">ApikeyListResponse</a></code>
- <code><a href="./src/resources/dashboard/apikeys.ts">ApikeyRevokeResponse</a></code>

Methods:

- <code title="post /dashboard/apikeys">client.dashboard.apikeys.<a href="./src/resources/dashboard/apikeys.ts">create</a>({ ...params }) -> ApikeyCreateResponse</code>
- <code title="get /dashboard/apikeys">client.dashboard.apikeys.<a href="./src/resources/dashboard/apikeys.ts">list</a>() -> ApikeyListResponse</code>
- <code title="delete /dashboard/apikeys/{keyId}">client.dashboard.apikeys.<a href="./src/resources/dashboard/apikeys.ts">revoke</a>(keyID) -> ApikeyRevokeResponse</code>

## Rules

Types:

- <code><a href="./src/resources/dashboard/rules.ts">RuleObject</a></code>
- <code><a href="./src/resources/dashboard/rules.ts">RuleListResponse</a></code>
- <code><a href="./src/resources/dashboard/rules.ts">RuleDeleteResponse</a></code>

Methods:

- <code title="post /dashboard/rules">client.dashboard.rules.<a href="./src/resources/dashboard/rules.ts">create</a>({ ...params }) -> RuleObject</code>
- <code title="put /dashboard/rules/{ruleId}">client.dashboard.rules.<a href="./src/resources/dashboard/rules.ts">update</a>(ruleID, { ...params }) -> RuleObject</code>
- <code title="get /dashboard/rules">client.dashboard.rules.<a href="./src/resources/dashboard/rules.ts">list</a>() -> RuleListResponse</code>
- <code title="delete /dashboard/rules/{ruleId}">client.dashboard.rules.<a href="./src/resources/dashboard/rules.ts">delete</a>(ruleID) -> RuleDeleteResponse</code>

# Check

Types:

- <code><a href="./src/resources/check.ts">CheckEnforceRateLimitResponse</a></code>

Methods:

- <code title="post /check">client.check.<a href="./src/resources/check.ts">enforceRateLimit</a>({ ...params }) -> string</code>
