# Build Phases

Do not build everything at once. The app should grow through small, reviewable phases.

## Phase 0: Foundation

Goal: keep the project stable.

Allowed work:

- Documentation and rules.
- Theme setup.
- App shell cleanup.
- Environment handling.
- Supabase client setup when needed.
- Basic navigation structure.

Not allowed:

- Purchases.
- Open community features.
- Deep AR.
- Native project changes.

## Phase 1: Core Mystery Prototype

Goal: prove the basic mystery loop.

Possible work:

- Chapter and signal models.
- A small clue/discovery flow.
- Local-friendly test content.
- Basic Supabase reads and writes.
- Permission states for camera or location if needed.

## Phase 2: Location and AR-Lite

Goal: make the world feel connected without unsafe complexity.

Possible work:

- Coarse location unlocks.
- Camera-based scanning or framing.
- Atmospheric overlays.
- Safety fallbacks.
- Device compatibility checks.

## Phase 3: Controlled Community

Goal: add community value without chaos.

Possible work:

- Read-only broadcasts.
- Curated theory submissions.
- Reporting flow.
- Moderation queue.
- Aggregate discovery stats.

## Phase 4: Monetization

Goal: add fair premium value after the core loop works.

Possible work:

- RevenueCat integration.
- Entitlement sync.
- Premium story expansions.
- Cosmetic or convenience upgrades.
- Clear restore purchases flow.

## Phase 5: Deeper AR and Live Operations

Goal: expand only after retention, safety, and stability are proven.

Possible work:

- Advanced AR experiments.
- Live events.
- More complex community tools.
- Content operations tooling.

## Phase Gate Checklist

Before moving phases, confirm:

- The previous phase works on real devices.
- Safety risks are documented.
- Data model changes are reviewed.
- UI remains consistent.
- No unnecessary libraries were added.
- Tests or manual verification notes exist.
