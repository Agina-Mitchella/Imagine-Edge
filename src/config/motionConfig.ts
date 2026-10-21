/**
 * Central motion and interaction configuration for Imaginedge Solutions.
 * Adjust timings, easing curves, stagger delays and pinning distances in one place.
 */

export const MOTION_CONFIG = {
  // Lenis inertia smooth scrolling
  lenis: {
    lerp: 0.1,
    smoothWheel: true,
  },

  // Easing curves
  easing: {
    reveal: 'power3.out',
    scrub: 'none',
    smooth: 'power2.out',
    magnetic: 'power2.out',
    snap: 'power1.inOut',
  },

  // Durations in seconds
  durations: {
    reveal: 0.8,
    quick: 0.4,
    magnetic: 0.35,
    slideChange: 0.6,
    tabWipe: 0.45,
  },

  // Stagger intervals in seconds
  stagger: {
    words: 0.035,
    icons: 0.06, // 60ms apart as requested
    cards: 0.08,
    logos: 0.025,
    badges: 0.1,
  },

  // Pinned scroll distances (ScrollTrigger end properties)
  pinDistances: {
    hero: '+=450%', // ~5 viewport heights scrub distance
    printingMethods: '+=380%', // 5 distinct print method steps
    selectedWork: '+=240%', // Horizontal card scrub
  },

  // Breakpoints
  desktopMin: 1024,
};
