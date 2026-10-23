import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CLIENT_LOGOS } from '../data/siteContent';
import { MOTION_CONFIG } from '../config/motionConfig';

gsap.registerPlugin(ScrollTrigger);

export const Clients: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const halfIndex = Math.ceil(CLIENT_LOGOS.length / 2);
  const row1Logos = CLIENT_LOGOS.slice(0, halfIndex);
  const row2Logos = CLIENT_LOGOS.slice(halfIndex);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!sectionEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // DESKTOP: Stagger logos and drift rows in opposite directions
    mm.add(MOTION_CONFIG.breakpoints.desktop, () => {
      const cards = sectionEl.querySelectorAll('.client-logo-card');
      gsap.fromTo(
        cards,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: MOTION_CONFIG.stagger.logos,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 85%',
          },
        }
      );

      if (r1) {
        gsap.to(r1, {
          xPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      if (r2) {
        gsap.to(r2, {
          xPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    });

    // MOBILE: Stagger logos and drift rows in opposite directions
    mm.add(MOTION_CONFIG.breakpoints.mobile, () => {
      const cards = sectionEl.querySelectorAll('.client-logo-card');
      gsap.fromTo(
        cards,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.04,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 88%',
          },
        }
      );

      if (r1) {
        gsap.to(r1, {
          xPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }

      if (r2) {
        gsap.to(r2, {
          xPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="clients"
      data-header-theme="light"
      className="relative w-full bg-cool text-charcoal py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-red block mb-2">
            Trusted By Industry Leaders
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
            We've worked with some of the biggest brands.
          </h2>
          <p className="mt-3 text-xs sm:text-base text-slate-600 font-normal">
            From multinational corporations and international development agencies to Kenyan public
            enterprises and high-growth ventures.
          </p>
        </div>

        {/* Opposite Drifting Rows (Row 1 Left, Row 2 Right) */}
        <div className="space-y-3 sm:space-y-5 overflow-hidden py-2">
          {/* Row 1: Drifts left */}
          <div
            ref={row1Ref}
            className="flex items-center gap-3 sm:gap-4 flex-nowrap justify-start will-change-transform"
          >
            {row1Logos.map((brandName, idx) => (
              <div
                key={idx}
                className="client-logo-card group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/90 hover:bg-white border border-slate-300/80 hover:border-red/40 transition-all duration-300 min-w-[130px] sm:min-w-[170px] min-h-[70px] sm:min-h-[90px] text-center shrink-0 cursor-default shadow-xs"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-red transition-colors tracking-tight line-clamp-2 px-1">
                  {brandName}
                </span>
                <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                  Client Partner
                </span>
              </div>
            ))}
          </div>

          {/* Row 2: Drifts right */}
          <div
            ref={row2Ref}
            className="flex items-center gap-3 sm:gap-4 flex-nowrap justify-start will-change-transform -translate-x-12 sm:-translate-x-20"
          >
            {row2Logos.map((brandName, idx) => (
              <div
                key={idx}
                className="client-logo-card group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/90 hover:bg-white border border-slate-300/80 hover:border-red/40 transition-all duration-300 min-w-[130px] sm:min-w-[170px] min-h-[70px] sm:min-h-[90px] text-center shrink-0 cursor-default shadow-xs"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-red transition-colors tracking-tight line-clamp-2 px-1">
                  {brandName}
                </span>
                <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                  Client Partner
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:mt-10 text-center text-xs text-slate-500 font-normal">
          All client trademarks and service marks are property of their respective organisations.
        </div>
      </div>
    </section>
  );
};
