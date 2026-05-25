# Architecture

This app is a production Expo mobile app for a Rabbits-style ARG. Future work must protect stability, clarity, and the product tone before adding cleverness.

## Current Stack

- Expo SDK 56, React Native 0.85, React 19, TypeScript, and Expo Router.
- Supabase is the backend system of record.
- RevenueCat is planned later; do not add billing code until the monetization phase is approved.
- AR starts as AR-lite using camera, location, media, motion, and spatial storytelling. Do not introduce deeper AR frameworks yet.

## Architecture Principles

- Keep the app in the managed Expo workflow unless the project owner explicitly approves otherwise.
- Do not modify native iOS or Android projects unless a documented Expo limitation makes it unavoidable.
- Prefer Expo SDK packages already in the project. New libraries require a written reason, alternatives considered, and expected maintenance cost.
- Treat location, identity, purchases, community content, and moderation as separate domains.
- Keep UI components reusable, but avoid abstracting before repeated real use exists.
- Keep business logic out of screens when it becomes shared or stateful.

## Suggested Code Boundaries

Use these boundaries when implementation begins:

- `src/app`: Expo Router routes, layouts, and navigation only.
- `src/components`: reusable presentation components.
- `src/features`: feature-specific screens, hooks, and components.
- `src/lib`: Supabase clients, environment helpers, analytics wrappers, and platform utilities.
- `src/services`: API-like operations that read or write remote data.
- `src/types`: shared TypeScript types.
- `src/theme`: colors, spacing, typography, and motion tokens.

Do not create a global catch-all utility folder for unrelated helpers.

## Data Flow

- Screens call feature hooks or service functions, not raw Supabase queries scattered throughout UI files.
- Service functions should return typed results and explicit errors.
- Server-side authority belongs in Supabase policies, functions, or database constraints, not only client checks.
- Cache and optimistic UI should be added only where the user experience needs it.

## Change Control

Before major rewrites, document:

1. What problem exists in the current structure.
2. Why a smaller change is insufficient.
3. Which files and user flows are affected.
4. How behavior will be verified.

Random rewrites, framework swaps, and broad folder reshuffles are not allowed without this justification.
