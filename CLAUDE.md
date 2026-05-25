# Project Agent Guide

This is a production mobile app for a Rabbits-style ARG. Keep future work stable, elegant, and restrained.

## Required Reading

- Read `AGENTS.md` before coding.
- Check the exact Expo SDK 56 docs at https://docs.expo.dev/versions/v56.0.0/ before writing or changing Expo-related code.
- Review the relevant file in `docs/` before implementing a feature.

## Hard Constraints

- Do not build features unless explicitly asked.
- Do not modify native iOS or Android code without explicit approval.
- Do not install packages without explaining why the existing stack is insufficient.
- Do not replace Expo Router, Supabase, TypeScript, or the managed Expo direction casually.
- Do not add RevenueCat, deep AR, live chat, open UGC, or background location until the approved phase.

## Product Direction

The app is community-driven, freemium, location-aware, mystery-focused, cinematic, immersive, elegant, premium, modernist, dark, and restrained. UI and copy should support that tone.

## Engineering Defaults

- Prefer small, typed, reviewable changes.
- Keep remote data access behind service functions.
- Keep visual tokens centralized once UI work begins.
- Preserve safety and moderation requirements for location and community features.
- Avoid chaotic rewrites and broad refactors unless the reason is documented.

## Documentation Map

- `docs/architecture.md`: system boundaries and code organization.
- `docs/product-rules.md`: product constraints and feature decision rules.
- `docs/game-design.md`: mystery, puzzle, and progression guidance.
- `docs/community-rules.md`: community limits and moderation prerequisites.
- `docs/ar-strategy.md`: AR-lite first strategy.
- `docs/ui-rules.md`: visual and interaction rules.
- `docs/design-references.md`: reference mood and visual boundaries.
- `docs/db-schema.md`: Supabase planning constraints.
- `docs/api-contracts.md`: service and data contract rules.
- `docs/build-phases.md`: approved growth sequence.
- `docs/monetization.md`: freemium and RevenueCat guardrails.
- `docs/safety-moderation.md`: safety requirements.
