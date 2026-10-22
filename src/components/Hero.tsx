import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_SLIDES } from '../data/siteContent';
import { MOTION_CONFIG } from '../config/motionConfig';
import { Magnetic } from './Magnetic';
import { smoothScrollTo } from '../utils/scrollHelper';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenQuote: (service?: string) => void;
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
  const scrollDownRef = useRef<HTMLButtonElement>(null);
  const bgShape1Ref = useRef<HTMLDivElement>(null);
  const bgShape2Ref = useRef<HTMLDivElement>(null);

  const brandSlide = HERO_SLIDES[0] || {
    title: 'BRANDED ITEMS PEOPLE ACTUALLY KEEP.',
    description:
      'We design, print and craft corporate merchandise, workwear, and promotional gifts that leave a lasting mark across East Africa.',
  };

  useEffect(() => {
    const heroEl = heroSectionRef.current;
    if (!heroEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // Word-by-word reveal for the main brand headline
    if (headlineRef.current) {
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

    // Scroll Down button fade out on scroll
    if (scrollDownRef.current) {
      gsap.to(scrollDownRef.current, {
        opacity: 0,
        scale: 0.85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: '+=20%',
          scrub: true,
        },
      });
    }

    // DESKTOP: Geometric background shapes subtle parallax
    mm.add(MOTION_CONFIG.breakpoints.desktop, () => {
      if (bgShape1Ref.current) {
        gsap.to(bgShape1Ref.current, {
          yPercent: MOTION_CONFIG.desktop.shapeParallax1,
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
          yPercent: MOTION_CONFIG.desktop.shapeParallax2,
          ease: 'none',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    });

    // MOBILE: Geometric background shapes parallax at half intensity
    mm.add(MOTION_CONFIG.breakpoints.mobile, () => {
      if (bgShape1Ref.current) {
        gsap.to(bgShape1Ref.current, {
          yPercent: MOTION_CONFIG.mobile.shapeParallax1,
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
          yPercent: MOTION_CONFIG.mobile.shapeParallax2,
          ease: 'none',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    });

    return () => {
      mm.revert();
    };
  }, []);

  const handleScrollDown = () => {
    smoothScrollTo('#what-we-make', -80);
  };

  return (
    <section
      ref={heroSectionRef}
      id="top"
      className="relative w-full min-h-[92vh] sm:min-h-screen bg-charcoal bg-hero-diagonal text-white overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-8 select-none"
    >
      {/* Subtle geometric accents with parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Shape 1: Subtle Red Outline Triangle Top Left */}
        <div ref={bgShape1Ref} className="absolute top-[14%] left-[5%] opacity-25 will-change-transform">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <polygon points="18,4 32,32 4,32" stroke="var(--red)" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Shape 2: Subtle Red Outline Triangle Bottom Right */}
        <div ref={bgShape2Ref} className="absolute bottom-[16%] right-[6%] opacity-20 will-change-transform">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <polygon points="22,5 39,39 5,39" stroke="var(--red)" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      {/* Top Header Row in Hero: Location Badge */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 flex items-center justify-center sm:justify-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-semibold tracking-wider text-slate-300 uppercase">
          <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
          <span>Nairobi · Kenya · East Africa</span>
        </div>
      </div>

      {/* Main Brand Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 text-center my-auto py-8 sm:py-12">
        <h1
          ref={headlineRef}
          className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.92] text-white drop-shadow-sm uppercase max-w-5xl mx-auto"
        >
          <span className="inline-block overflow-hidden mr-2 sm:mr-3">
            <span className="hero-word inline-block">BRANDED</span>
          </span>
          <span className="inline-block overflow-hidden mr-2 sm:mr-3">
            <span className="hero-word inline-block">ITEMS</span>
          </span>
          <span className="inline-block overflow-hidden mr-2 sm:mr-3">
            <span className="hero-word inline-block">PEOPLE</span>
          </span>
          <br />
          <span className="inline-block overflow-hidden mr-2 sm:mr-3">
            <span className="hero-word inline-block text-red underline decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8">
              ACTUALLY
            </span>
          </span>
          <span className="inline-block overflow-hidden">
            <span className="hero-word inline-block">KEEP.</span>
          </span>
        </h1>

        <p className="mt-5 sm:mt-7 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed px-2">
          {brandSlide.description}
        </p>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5">
          <Magnetic strength={0.3}>
            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="min-h-[46px] px-7 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white bg-red hover:bg-red-hover active:scale-95 rounded-full transition-all shadow-lg hover:shadow-red-900/40 cursor-pointer"
            >
              Contact us
            </button>
          </Magnetic>

          <Magnetic strength={0.2}>
            <a
              href="#selected-work"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo('#selected-work', -80);
              }}
              className="min-h-[46px] inline-flex items-center justify-center px-7 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-full transition-all cursor-pointer"
            >
              See our work
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Bottom Row: Scroll Down Indicator */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 flex items-center justify-center pt-2">
        <button
          ref={scrollDownRef}
          type="button"
          onClick={handleScrollDown}
          className="min-h-[44px] px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-white/10"
          aria-label="Scroll down to What We Make"
        >
          <span>Explore products</span>
          <ArrowDown className="w-3.5 h-3.5 text-red animate-bounce" />
        </button>
      </div>
    </section>
  );
};
