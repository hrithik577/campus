/**
 * JS-side mirror of the CSS custom properties defined in globals.css.
 * Use these when a value is needed in Framer Motion transitions, inline
 * styles, or computed logic — not for anything Tailwind can express.
 * Keep in sync with :root in src/app/globals.css.
 */

export const motionTokens = {
  duration: {
    fast: 0.12,
    base: 0.2,
    slow: 0.32,
    sheet: 0.38,
  },
  ease: {
    standard: [0.4, 0, 0.2, 1] as const,
    decelerate: [0, 0, 0.2, 1] as const,
    accelerate: [0.4, 0, 1, 1] as const,
    spring: { type: 'spring', stiffness: 380, damping: 32 } as const,
  },
};

export const zIndex = {
  map: 0,
  mapControls: 10,
  header: 40,
  bottomNav: 40,
  sheet: 50,
  command: 60,
  modal: 70,
  toast: 80,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 999,
};

/** Shared sheet transition — drag-to-dismiss friendly, used by every bottom sheet. */
export const sheetTransition = {
  type: 'spring',
  stiffness: 420,
  damping: 38,
  mass: 0.9,
} as const;
