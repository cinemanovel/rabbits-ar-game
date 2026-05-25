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

## Approved Phase 0 Tables

### `profiles`

Purpose: stores the current signed-in player's basic identity settings. This is not a social profile system and does not expose public browsing, following, messaging, community posting, or gameplay state.

Fields:

- `id`: UUID primary key, references `auth.users(id)` with `on delete cascade`.
- `display_name`: required text, 1-48 characters.
- `handle`: required text, 3-24 characters, lowercase letters/numbers/underscores only, unique case-insensitively.
- `bio`: required text defaulting to an empty string, max 160 characters.
- `avatar_placeholder`: required text defaulting to `signal`, max 32 characters. This is a placeholder token only, not an uploaded image.
- `onboarding_completed`: required boolean defaulting to `false`.
- `created_at`: required timestamp defaulting to `now()`.
- `updated_at`: required timestamp defaulting to `now()` and maintained by trigger.

Security:

- Row-level security must be enabled.
- Authenticated users may select, insert, update, and delete only their own row where `auth.uid() = id`.
- No anonymous access.
- No public profile listing or handle search policy yet.

Deferred:

- Profile images and storage buckets.
- Public social profile pages.
- Following, messaging, community posting, or social discovery.
- Game progress, inventory, ranks, or achievements.
- Moderation tables for user-generated profile content beyond owner-only access.

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
