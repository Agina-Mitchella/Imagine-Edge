import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_CONFIG } from '../config/motionConfig';
import { Magnetic } from './Magnetic';
import { smoothScrollTo } from '../utils/scrollHelper';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenQuote: () => void;
  onOpenLightbox?: (item: {
    title: string;
    client: string;
    specs: string;
    image: string;
    materials?: string;
    category?: string;
  }) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const heroSectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollDownRef = useRef<HTMLDivElement>(null);
  const bgShape1Ref = useRef<HTMLDivElement>(null);
  const bgShape2Ref = useRef<HTMLDivElement>(null);

  // GSAP Context for word reveal and parallax
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heroEl = heroSectionRef.current;
    if (!heroEl) return;

    const ctx = gsap.context(() => {
      // 1. Initial word-by-word headline reveal on load
      if (headlineRef.current && !prefersReducedMotion) {
        const words = headlineRef.current.querySelectorAll('.hero-word');
        gsap.fromTo(
          words,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: MOTION_CONFIG.stagger.words,
            duration: MOTION_CONFIG.durations.reveal,
            ease: MOTION_CONFIG.easing.reveal,
            delay: 0.1,
          }
        );
      }

      // 2. Subtle parallax drift for geometric accents
      if (!prefersReducedMotion) {
        if (bgShape1Ref.current) {
          gsap.to(bgShape1Ref.current, {
            yPercent: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: heroEl,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          });
        }
        if (bgShape2Ref.current) {
          gsap.to(bgShape2Ref.current, {
            yPercent: -60,
            ease: 'none',
            scrollTrigger: {
              trigger: heroEl,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }
      }

      // 3. Scroll Down button fade out within first 12% of scroll
      if (scrollDownRef.current) {
        gsap.to(scrollDownRef.current, {
          opacity: 0,
          scale: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: '+=15%',
            scrub: true,
          },
        });
      }
    }, heroSectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleScrollDown = () => {
    smoothScrollTo('#what-we-make', -80);
  };

  return (
    <section
      ref={heroSectionRef}
      id="top"
      className="relative w-full min-h-screen bg-charcoal bg-hero-diagonal text-white overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-12 select-none"
    >
      {/* Subtle geometric accents with parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Shape 1: Subtle Red Outline Triangle Top Left */}
        <div ref={bgShape1Ref} className="absolute top-[16%] left-[6%] opacity-25 will-change-transform">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <polygon points="18,4 32,32 4,32" stroke="var(--red)" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Shape 2: Subtle Red Outline Triangle Bottom Right */}
        <div ref={bgShape2Ref} className="absolute bottom-[18%] right-[8%] opacity-20 will-change-transform">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <polygon points="22,5 39,39 5,39" stroke="var(--red)" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      {/* Main Hero Stage */}
      <div className="relative z-10 flex-1 flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-8 w-full my-auto">
        <div className="w-full text-center max-w-5xl mx-auto py-10 sm:py-16">
          <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-slate-300 uppercase">
            <span className="w-2 h-2 rounded-full bg-red" />
            <span>Nairobi · Kenya · East Africa</span>
          </div>

          {/* Giant Condensed Headline with word-by-word reveal */}
          <h1
            ref={headlineRef}
            className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.92] text-white drop-shadow-sm uppercase max-w-5xl mx-auto"
          >
            <span className="inline-block overflow-hidden mr-3">
              <span className="hero-word inline-block">BRANDED</span>
            </span>
            <span className="inline-block overflow-hidden mr-3">
              <span className="hero-word inline-block">ITEMS</span>
            </span>
            <span className="inline-block overflow-hidden mr-3">
              <span className="hero-word inline-block">PEOPLE</span>
            </span>
            <br />
            <span className="inline-block overflow-hidden mr-3">
              <span className="hero-word inline-block text-red underline decoration-4 sm:decoration-8 underline-offset-8">
                ACTUALLY
              </span>
            </span>
            <span className="inline-block overflow-hidden">
              <span className="hero-word inline-block">KEEP.</span>
            </span>
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            We design, print and craft corporate merchandise, workwear, and promotional gifts that
            leave a lasting mark across organisations and institutions.
          </p>

          {/* Magnetic CTA Buttons */}
          <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Magnetic strength={0.35}>
              <button
                type="button"
                onClick={onOpenQuote}
                className="px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white bg-red hover:bg-red-hover active:scale-95 rounded-full transition-all shadow-xl hover:shadow-red-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red cursor-pointer"
              >
                Contact us
              </button>
            </Magnetic>

            <Magnetic strength={0.25}>
              <a
                href="#selected-work"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('#selected-work', -80);
                }}
                className="px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white inline-block cursor-pointer"
              >
                See our work
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Bottom Center: Rotating circular "SCROLL DOWN" stamp button */}
      <div
        ref={scrollDownRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center transition-opacity will-change-transform pt-4"
      >
        <button
          type="button"
          onClick={handleScrollDown}
          className="group relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red rounded-full cursor-pointer hover:scale-105 transition-transform"
          aria-label="Scroll down to What We Make section"
        >
          <svg
            className="w-full h-full animate-spin-slow text-white/70 group-hover:text-white transition-colors"
            viewBox="0 0 100 100"
          >
            <path
              id="scrollTextPath"
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="none"
            />
            <text className="text-[10.5px] font-bold uppercase tracking-[0.24em] fill-current">
              <textPath href="#scrollTextPath" startOffset="0%">
                · SCROLL DOWN · SCROLL DOWN ·
              </textPath>
            </text>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 group-hover:bg-red text-white flex items-center justify-center transition-colors shadow-inner">
              <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};
