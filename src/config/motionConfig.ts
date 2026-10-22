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
    icons: 0.06,
    iconsDesktop: 0.06,
    iconsMobile: 0.1,
    cards: 0.08,
    logos: 0.025,
    badges: 0.1,
  },

  // Pinned scroll distances (ScrollTrigger end properties)
  pinDistances: {
    hero: '+=450%',
    printingMethods: '+=380%',
    selectedWork: '+=240%',
  },

  // Desktop specific settings
  desktop: {
    shapeParallax1: -30,
    shapeParallax2: 40,
    heroPin: '+=450%',
  },

  // Mobile specific settings
  mobile: {
    shapeParallax1: -15,
    shapeParallax2: 20,
    heroPin: '+=300%',
  },

  // Breakpoints
  desktopMin: 1024,
  breakpoints: {
    desktop: '(min-width: 1024px)',
    mobile: '(max-width: 1023px)',
  },
};
