export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

/** Durations in seconds. Micro-interactions 150-250ms, content 300-600ms. */
export const DURATION = {
  micro: 0.2,
  base: 0.45,
  slow: 0.7,
  cinematic: 1.1,
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  shown: { opacity: 1 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 1.015 },
  shown: { opacity: 1, scale: 1 },
};

/** Parent that releases its children in sequence. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  shown: {
    transition: { staggerChildren, delayChildren },
  },
});