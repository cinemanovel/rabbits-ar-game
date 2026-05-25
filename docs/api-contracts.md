# API Contracts

The app should treat Supabase and future server functions as stable contracts, not ad hoc calls from random screens.

## Contract Principles

- Client code should call named service functions for remote reads and writes.
- Service functions should have typed inputs, typed outputs, and predictable error shapes.
- Do not expose database table details throughout UI components.
- Keep authorization enforced on the server side with RLS, policies, and functions.
- Do not trust client-only checks for purchases, moderation, or progression integrity.

## Suggested Result Shape

When implementation begins, prefer a simple result pattern:

- success result with `data`.
- failure result with `error`, `code`, and optional `details`.

Avoid throwing raw Supabase errors directly into UI components.

## Contract Areas

Expected contract groups:

- Auth and profile.
- Chapter and signal discovery.
- Puzzle attempt and unlock state.
- Location eligibility.
- Community submissions and reports.
- Moderation actions.
- Entitlement and premium access.

## Versioning

Before changing a contract used by multiple screens:

1. Find all callers.
2. Update types first.
3. Keep behavior explicit.
4. Add tests or manual verification notes.
5. Avoid silent shape changes.

## Security Rules

- Never put Supabase service role keys in the mobile app.
- Never put RevenueCat secrets in the mobile app.
- Do not rely on hidden route names or disabled buttons for access control.
- Validate user input before writing it.
- Rate-limit or otherwise protect expensive or abuse-prone actions on the backend when available.

## Offline and Failure Behavior

Mystery should not become broken UI. For each remote operation, define:

- loading state.
- empty state.
- permission denied state.
- offline or network failure state.
- retry behavior.
