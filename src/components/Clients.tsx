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

    const ctx = gsap.context(() => {
      // 1. Logos stagger in with soft scale-up
      const cards = sectionEl.querySelectorAll('.client-logo-card');
      gsap.fromTo(
        cards,
        { scale: 0.88, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: MOTION_CONFIG.stagger.logos,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 82%',
          },
        }
      );

      // 2. Two rows drift slowly in opposite directions as you scroll
      if (r1) {
        gsap.to(r1, {
          xPercent: -8,
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
          xPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="clients"
      className="relative w-full bg-cool text-charcoal py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-red block mb-2">
            Trusted By Industry Leaders
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
            We've worked with some of the biggest brands.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-normal">
            From multinational corporations and international development agencies to Kenyan public
            enterprises and high-growth ventures.
          </p>
        </div>

        {/* Scroll-Linked Opposite Drifting Rows (Row 1 Left, Row 2 Right) */}
        <div className="space-y-4 sm:space-y-6">
          {/* Row 1 */}
          <div
            ref={row1Ref}
            className="flex items-center gap-3 sm:gap-4 flex-wrap md:flex-nowrap justify-center md:justify-start will-change-transform"
          >
            {row1Logos.map((brandName, idx) => (
              <div
                key={idx}
                className="client-logo-card group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/80 hover:bg-white border border-slate-300/80 hover:border-red/40 transition-all duration-300 min-w-[130px] sm:min-w-[170px] min-h-[80px] sm:min-h-[95px] text-center shrink-0 cursor-default shadow-sm"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-600 group-hover:text-red transition-colors tracking-tight line-clamp-2 px-1">
                  {brandName}
                </span>
                <span className="text-[9px] text-slate-400 group-hover:text-slate-600 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Client Partner
                </span>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div
            ref={row2Ref}
            className="flex items-center gap-3 sm:gap-4 flex-wrap md:flex-nowrap justify-center md:justify-start will-change-transform"
          >
            {row2Logos.map((brandName, idx) => (
              <div
                key={idx}
                className="client-logo-card group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/80 hover:bg-white border border-slate-300/80 hover:border-red/40 transition-all duration-300 min-w-[130px] sm:min-w-[170px] min-h-[80px] sm:min-h-[95px] text-center shrink-0 cursor-default shadow-sm"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-600 group-hover:text-red transition-colors tracking-tight line-clamp-2 px-1">
                  {brandName}
                </span>
                <span className="text-[9px] text-slate-400 group-hover:text-slate-600 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Client Partner
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-slate-500 font-normal">
          All client trademarks and service marks are property of their respective organisations.
          Sample production kits provided under NDA upon request.
        </div>
      </div>
    </section>
  );
};
