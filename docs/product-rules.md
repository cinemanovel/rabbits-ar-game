# Product Rules

This is a cinematic, community-driven, freemium ARG mobile game. Product decisions should preserve mystery, trust, and long-term scalability.

## Product North Star

The app should make players feel that the real world contains hidden signals, fragments, and coordinated community discoveries. It should feel premium and restrained, not noisy or gimmicky.

## Core Product Pillars

- Mystery first: reveal just enough to create curiosity.
- Community matters: players should feel part of a living investigation.
- Location-aware, not location-exploitative: location should create atmosphere and puzzle context without unsafe behavior.
- Cinematic restraint: use sound, motion, light, copy, and pacing carefully.
- Freemium fairness: paid features may deepen immersion but must not make the core mystery feel impossible without payment.

## Do Not Build Yet

Do not implement features just because they are mentioned in docs. These docs define direction and constraints, not a feature backlog.

Avoid adding:

- Live chat.
- User-generated public posting.
- Real-money purchases.
- Complex AR frameworks.
- Competitive leaderboards.
- Private messaging.
- Background location tracking.

Each of those requires separate design, safety, and moderation review.

## Product Decision Rules

- Every feature must answer: what mystery does this deepen?
- Every notification must be rare, useful, and atmospheric.
- Every mechanic must work for a solo player and become better with community participation.
- Every location feature must have a non-dangerous fallback.
- Every premium feature must be understandable before purchase.

## Beginner-Friendly Implementation Guidance

When adding a new feature later, write a short note first:

1. Player goal.
2. Game reason.
3. Required data.
4. Safety concern.
5. Free vs paid behavior.
6. How it can be tested without real-world travel.
