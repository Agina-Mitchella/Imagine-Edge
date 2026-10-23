import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

interface FeaturedProject {
  id: string;
  client: string;
  product: string;
  caption: string;
  image?: string; // Slot for real user uploaded image; defaults to faint tribal pattern on charcoal
}

const HERO_IMAGE = '/assets/aistudio/IMG_9373_c2059a32.jpeg';

// Featured project hero image as provided by user
const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'imaginedge-stationery',
    client: 'Imaginedge Solutions',
    product: 'Executive notebooks & branded stationery',
    caption: 'Imaginedge · Executive notebooks & stationery',
    image: HERO_IMAGE,
  },
];

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const heroContainerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Autoplay every 6 seconds with smooth crossfade
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % FEATURED_PROJECTS.length);
    }, 6000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? FEATURED_PROJECTS.length - 1 : prev - 1));
    resetTimer();
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % FEATURED_PROJECTS.length);
    resetTimer();
  };

  const handleSelectSlide = (index: number) => {
    setCurrentSlideIndex(index);
    resetTimer();
  };

  // Entrance animations respecting prefers-reduced-motion
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const lines = headlineRef.current?.querySelectorAll('.hero-reveal-line');
    const paraEl = paragraphRef.current;
    const btnsEl = buttonsRef.current;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(cardEl, { opacity: 1, y: 0 });
      if (lines) gsap.set(lines, { opacity: 1, y: '0%' });
      if (paraEl) gsap.set(paraEl, { opacity: 0.85, y: 0 });
      if (btnsEl) gsap.set(btnsEl, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Card fades up
    tl.fromTo(
      cardEl,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.65, delay: 0.15 }
    );

    // 2. Headline reveals line by line behind mask (staggered 80ms)
    if (lines && lines.length > 0) {
      tl.fromTo(
        lines,
        { y: '115%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.6, stagger: 0.08 },
        '-=0.35'
      );
    }

    // 3. Paragraph fades up
    if (paraEl) {
      tl.fromTo(
        paraEl,
        { opacity: 0, y: 14 },
        { opacity: 0.85, y: 0, duration: 0.45 },
        '-=0.25'
      );
    }

    // 4. Buttons fade in last
    if (btnsEl) {
      tl.fromTo(
        btnsEl,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.2'
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const currentProject = FEATURED_PROJECTS[currentSlideIndex];

  return (
    <section
      ref={heroContainerRef}
      id="top"
      data-header-theme="dark"
      className="relative m-2 sm:m-4 rounded-[28px] overflow-hidden bg-[#15171A] text-white h-[calc(100svh-16px)] sm:h-[calc(100svh-32px)] min-h-[640px] flex flex-col justify-between select-none shadow-2xl"
      aria-label="Hero showcase"
    >
      {/* Background Photo Slider with soft dark gradient & charcoal tribal fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {FEATURED_PROJECTS.map((project, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={project.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Full-bleed product image */}
              <img
                src={project.image}
                alt={project.caption}
                className="w-full h-full object-cover object-center"
              />

              {/* Soft dark gradient for maximum legibility */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(21,23,26,0.65) 0%, rgba(21,23,26,0.35) 55%, rgba(21,23,26,0.15) 100%)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Floating Header Clearance Spacer (Guarantees >= 24px clearance below floating header) */}
      <div className="relative z-10 w-full pt-24 sm:pt-28" aria-hidden="true" />

      {/* Main Content Area: Centred vertically on desktop, bottom-aligned on mobile */}
      <div className="relative z-20 flex-1 flex flex-col justify-end sm:justify-center px-2 sm:px-8 lg:px-12 pb-4 sm:pb-8">
        {/* Frosted Glass Card (left-aligned desktop max 620px, full-width on mobile minus 16px margins) */}
        <div
          ref={cardRef}
          className="w-[calc(100%-16px)] sm:w-full max-w-[620px] mx-auto sm:mx-0 p-7 sm:p-10 rounded-[24px] bg-[#15171A]/55 backdrop-blur-[18px] border border-white/12 shadow-2xl"
        >
          {/* Eyebrow: NAIROBI, KENYA in 13px Poppins SemiBold, #F0C020, letter-spacing 0.14em */}
          <p className="font-poppins font-semibold uppercase text-[13px] tracking-[0.14em] text-[#F0C020] mb-3 sm:mb-4">
            NAIROBI, KENYA
          </p>

          {/* Headline: Poppins ExtraBold, clamp(2.25rem, 5vw, 4.25rem), leading 1.05, tracking -0.02em, 4px #B52026 underline under "actually" */}
          <h1
            ref={headlineRef}
            className="font-poppins font-extrabold text-white text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.05] tracking-[-0.02em]"
          >
            <span className="block overflow-hidden">
              <span className="hero-reveal-line block">Branded items</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-reveal-line block">
                people{' '}
                <span className="relative inline-block pb-1">
                  actually
                  <span
                    className="absolute left-0 bottom-0.5 w-full h-[4px] bg-[#B52026] rounded-full"
                    aria-hidden="true"
                  />
                </span>{' '}
                keep.
              </span>
            </span>
          </h1>

          {/* Paragraph (white at 85%, 18px Poppins) */}
          <p
            ref={paragraphRef}
            className="font-poppins text-white/85 text-base sm:text-[18px] leading-relaxed mt-4 sm:mt-5 max-w-xl"
          >
            Garments, drinkware, banners, bags and corporate gifts. Designed, printed and delivered by a Kenyan-owned team.
          </p>

          {/* Buttons: solid #B52026 pill "Get a quote" with arrow & outlined white pill "See our work" */}
          <div
            ref={buttonsRef}
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={() => onOpenQuote()}
                className="font-poppins font-bold text-xs sm:text-sm text-white bg-[#B52026] hover:bg-[#9C1A1F] active:scale-95 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full inline-flex items-center gap-2.5 transition-all shadow-lg hover:shadow-red-900/40 cursor-pointer"
              >
                <span>Get a quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Magnetic>

            <Magnetic strength={0.2}>
              <a
                href="#selected-work"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('#selected-work', -80);
                }}
                className="font-poppins font-semibold text-xs sm:text-sm text-white border-2 border-white/80 hover:border-white hover:bg-white/10 active:scale-95 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full inline-flex items-center justify-center transition-all cursor-pointer"
              >
                <span>See our work</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Caption Chip & Photo Slider Controls at Bottom Right */}
      <div className="absolute top-26 right-3 sm:top-auto sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 sm:gap-3 max-w-[calc(100%-24px)]">
        {/* Caption Chip */}
        <div
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#15171A]/55 backdrop-blur-[18px] border border-white/12 text-white font-poppins text-xs sm:text-sm font-medium shadow-lg select-none truncate"
          title={currentProject.caption}
        >
          <span>{currentProject.caption}</span>
        </div>

        {/* Slide Dots (when multiple projects exist) */}
        {FEATURED_PROJECTS.length > 1 && (
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-2 rounded-full bg-[#15171A]/55 backdrop-blur-[18px] border border-white/12 shadow-lg"
            role="tablist"
            aria-label="Featured projects"
          >
            {FEATURED_PROJECTS.map((project, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show ${project.caption}`}
                  onClick={() => handleSelectSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive ? 'w-5 bg-[#B52026]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Prev & Next 44px Arrow Buttons (when multiple projects exist) */}
        {FEATURED_PROJECTS.length > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-[#15171A]/55 backdrop-blur-[18px] border border-white/12 text-white hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-lg"
              aria-label="Previous project photo"
              title="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-[#15171A]/55 backdrop-blur-[18px] border border-white/12 text-white hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-lg"
              aria-label="Next project photo"
              title="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
