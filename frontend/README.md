# RateShield Frontend

This is the Next.js dashboard workspace for RateShield.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- shadcn/ui-compatible project structure

## Run

1. Install dependencies:

```bash
npm install
```

2. Start the frontend:

```bash
npm run dev
```

3. Point it at the Go API if needed:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Notes

- Dashboard routes use the JWT returned by `/auth/login` or `/auth/register`.
- The current Go websocket route is JWT-header-protected, which browsers cannot use directly for native websocket auth. The frontend therefore uses HTTP loading only until the backend exposes cookie- or query-based websocket auth.
