# Campus Twin — Design System (v1)

Foundation layer for the premium redesign. This is additive: nothing existing
was deleted or renamed, so every current screen still compiles and behaves
exactly as before. New screens/components should build on this instead of
inventing new colors, radii, or shadows.

## Where things live

| Layer | File |
|---|---|
| Design tokens (CSS vars) | `src/app/globals.css` (`:root`) |
| JS mirror of motion/z-index tokens | `src/lib/tokens.ts` |
| `cn()` classname helper | `src/lib/cn.ts` |
| UI primitives | `src/components/ui/*` |

Import primitives from the barrel: `import { Button, Badge, Panel } from '@/components/ui'`
(or relative path `../ui` depending on file depth).

## Tokens

**Color** — neutrals (`--background` → `--surface-sunken`), ink scale
(`--ink`, `--ink-secondary`, `--ink-tertiary`), brand accent as a full scale
(`--accent-50` … `--accent-900`, with `--accent` as the default working
color), and semantic status colors (`--success`, `--warning`, `--danger`,
`--info`, each with a `-soft` background and `-border` pairing). Status
colors are shared across building state, ticket priority, and crowd level —
don't introduce new one-off greens/reds per screen.

**Typography** — utility classes, not raw Tailwind text sizes, for anything
that should look consistent everywhere:
- `.text-display` — the big number: ETA, ticket ID, ask-AI headline distance
- `.text-title` — sheet/modal titles, building name
- `.text-heading` — section headers within a panel
- `.text-body-default` — paragraph copy
- `.text-caption` — secondary metadata (muted)
- `.text-micro` — uppercase badges/labels
- `.text-nums` — add to anything showing a distance/ETA/count so digits don't jitter (tabular-nums)

**Radius** — `--radius-sm` (8, inputs/badges) → `--radius-xl` (22, sheets/modals) → `--radius-full` (pills/avatars).

**Elevation** — `--shadow-xs/sm/md/lg` for general depth, plus two
purpose-built ones: `--shadow-float` (floating map controls) and
`--shadow-sheet` (bottom sheets — already wired into the existing
`.mobile-sheet-surface` class).

**Motion** — `--duration-fast/base/slow/sheet` + `--ease-standard/decelerate/accelerate/spring`
as CSS vars for Tailwind arbitrary values (`duration-[var(--duration-base)]`),
and the same values as plain numbers in `src/lib/tokens.ts` for Framer Motion
`transition` props. A global `prefers-reduced-motion` rule already collapses
all durations to ~0.

**Z-index** — one scale (`--z-map` → `--z-toast`) so map controls, header,
sheets, command palette, modals, and toasts can never silently collide again.

## Primitives (`src/components/ui`)

- **`Button` / `IconButton`** — variants `primary | secondary | outline | ghost | danger`, sizes `sm | md | lg`, built-in loading spinner. Already wired into `Header` (notification bell, Ask AI trigger) as a working example.
- **`Badge` / `StatusDot`** — status/category pills and live-state dots, tone-matched to the semantic color tokens (building open/closed, ticket priority, crowd level).
- **`Input` / `Field`** — text input with leading/trailing icon slots, plus a label+helper+error wrapper.
- **`Panel` / `PanelHeader`** — the one card treatment for desktop contextual panels and admin surfaces.
- **`Modal`** — centered dialog for desktop; mobile flows should use the existing `MobileBottomSheet` instead (now re-themed onto the same tokens, using `IconButton` for its close affordance).
- **`SegmentedControl`** — pill toggle group for map layers, floor selection, category filters.

## What's intentionally not changed yet

This pass is foundation-only, per the agreed scope. The primitives exist and
are proven to compile/typecheck against the real app, and two live
components (`Header`, `MobileBottomSheet`) already consume them — but the
bulk of the UI (map, navigation HUD, AI panel, admin tables, report wizard)
still uses its original hand-rolled classes. Migrating each of those onto
these primitives is the natural next phase, screen by screen, so regressions
stay easy to spot and roll back.

## Verification done

- `npx tsc --noEmit` — clean, no type errors introduced.
- `npx eslint` on all new/edited files — 0 errors (pre-existing unused-import
  warnings in `Header.tsx` untouched, one pre-existing lint warning in
  `MobileBottomSheet.tsx` untouched — neither introduced by this change).
- Full `next build` currently can't complete in this sandbox because it
  can't reach `fonts.googleapis.com` for `next/font/google` (network
  policy, unrelated to these changes) — verify with a normal `npm run build`
  on your machine/CI where that's reachable.
