# AR Strategy

AR should support the mystery. It should not become the product before the core loop works.

## AR-Lite First

The first version should use lightweight mobile capabilities:

- Camera view for scanning, framing, or atmosphere.
- Location permission for contextual unlocks.
- Device motion only if it improves a specific interaction.
- Image overlays, symbols, audio, light, and timing.
- Static or simple animated effects.

This can feel immersive without adding complex native AR dependencies.

## Do Not Add Yet

Do not add these until the AR-lite loop proves value:

- ARKit-specific native code.
- ARCore-specific native code.
- Custom native modules.
- 3D engines.
- Persistent world anchors.
- Shared multiplayer AR sessions.
- Computer vision pipelines beyond approved Expo packages.

## Permission Rules

- Ask for camera or location only at the moment the player understands why it is needed.
- Provide clear denied-permission states.
- Avoid background location tracking.
- Do not store precise location unless there is a documented gameplay and safety reason.
- Prefer coarse geofencing for story unlocks.

## Technical Direction

- Start with Expo-managed packages such as `expo-camera`, `expo-location`, `expo-device`, and `expo-constants` already present in the project.
- Check the exact Expo SDK 56 docs before using or changing Expo APIs.
- Keep AR logic isolated from screen layout so it can later be upgraded.
- Treat AR scenes as feature modules with explicit inputs: puzzle id, location context, permissions, and unlock state.

## Upgrade Gates

Deeper AR should require proof that:

1. Players understand and enjoy AR-lite interactions.
2. The story needs spatial persistence or advanced tracking.
3. Battery, accessibility, and device support are acceptable.
4. Expo managed workflow can still be preserved or the native cost is approved.
