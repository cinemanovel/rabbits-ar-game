# UI Rules

The interface should feel modernist, dark, elegant, cinematic, and restrained. Avoid decorative clutter.

## Visual Direction

- Dark surfaces with subtle contrast.
- Sparse layouts with strong spacing.
- Premium typography and quiet hierarchy.
- Minimal color accents used for meaning.
- Motion that feels deliberate and atmospheric.
- Interfaces that look like instruments, files, signals, maps, or evidence systems.

## Design Tokens

When implementation begins, centralize these in a theme module before spreading values across screens:

- Background colors.
- Surface colors.
- Text colors.
- Accent colors.
- Spacing scale.
- Border radius.
- Typography sizes and weights.
- Motion durations.

Do not hard-code one-off colors and spacing throughout the app.

## Color Guidance

Use a restrained palette:

- Near-black backgrounds.
- Charcoal surfaces.
- Soft off-white text.
- Muted gray secondary text.
- One or two accents such as cold blue, signal green, or amber.

Avoid bright default Expo blues, candy gradients, neon overload, and playful cartoon palettes unless a specific story moment requires contrast.

## Component Rules

- Build small components around repeated patterns: panels, signal cards, clue rows, chapter headers, permission states, and primary actions.
- Components should accept content and state, not know unrelated game rules.
- Keep touch targets large enough for mobile use.
- Avoid dense tables and developer-looking debug screens in player-facing UI.

## Copy Rules

- Short, precise, atmospheric.
- Do not overexplain the mystery.
- Use plain language for permissions, purchases, safety, and errors.
- Never hide legal, safety, or payment meaning behind lore.

## Accessibility

- Maintain readable contrast.
- Support dynamic text where possible.
- Do not rely on color alone for state.
- Provide non-location or non-camera alternatives for critical progression.
- Keep motion subtle and avoid mandatory rapid reactions.
