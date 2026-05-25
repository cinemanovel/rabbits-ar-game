# Database Schema

This document is a planning guide for Supabase. Do not create tables or migrations until the related feature phase is approved.

## Database Principles

- Supabase is the source of truth for accounts, progress, community state, purchases, and moderation records.
- Important game progress should not live only on the device.
- Use row-level security for all player-owned or sensitive data.
- Store precise location only when necessary and approved.
- Prefer explicit status fields over ambiguous booleans when a record has a lifecycle.
- Keep auditability for moderation, purchases, and safety-sensitive actions.

## Likely Tables

These are expected concepts, not a migration request:

- `profiles`: public-safe player profile data linked to auth users.
- `chapters`: major story containers.
- `signals`: discoverable clues, broadcasts, or events.
- `discoveries`: player-specific unlock records.
- `locations`: approved story places or geofenced regions.
- `puzzles`: puzzle definitions and unlock rules.
- `puzzle_attempts`: player attempts and outcomes.
- `community_theories`: moderated or curated theory submissions.
- `reports`: player reports for content or behavior.
- `moderation_actions`: audit trail for moderator decisions.
- `entitlements`: paid access state, eventually synced from RevenueCat.

## Field Guidelines

Most tables should include:

- `id` as UUID.
- `created_at` and `updated_at` timestamps.
- `status` for lifecycle state where needed.
- `created_by` when records are user-authored.
- Clear foreign keys for ownership and game structure.

Avoid storing secrets, private API keys, raw payment data, or unnecessary personal information.

## Location Data

Location records should distinguish between:

- Public story places.
- Approximate geofences.
- Player check-ins or unlock events.
- Sensitive precise coordinates.

Default to approximate regions. If precise coordinates are needed, document retention, visibility, and safety implications.

## Migration Rules

Before writing a migration:

1. Confirm the feature phase.
2. Define RLS behavior.
3. Define indexes for expected reads.
4. Define deletion and retention behavior.
5. Add TypeScript types or generated types strategy.
6. Add seed data only when it is safe for all environments.
