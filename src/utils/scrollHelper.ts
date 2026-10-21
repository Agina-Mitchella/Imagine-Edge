import type Lenis from 'lenis';

let globalLenisInstance: Lenis | null = null;

export const setGlobalLenis = (instance: Lenis | null) => {
  globalLenisInstance = instance;
};

export const getGlobalLenis = () => globalLenisInstance;

export const smoothScrollTo = (target: string | HTMLElement, offset = -80) => {
  if (globalLenisInstance) {
    globalLenisInstance.scrollTo(target, {
      offset,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    // Fallback native
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      const top = target.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
};
