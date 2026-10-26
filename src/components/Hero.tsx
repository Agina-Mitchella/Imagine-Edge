import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from './Magnetic';
import { smoothScrollTo } from '../utils/scrollHelper';
import heroStudioImg from '../assets/images/hero_studio_showcase_1792832089576.jpg';
import heroFlatlayImg from '../assets/images/hero_studio_flatlay_1793005975591.jpg';

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
  image?: string;
}

// Creative high-definition imagery for the hero background (guaranteed on Vercel and local)
const HERO_STUDIO = heroStudioImg || '/assets/images/hero_studio_showcase_1792832089576.jpg';
const HERO_FLATLAY = heroFlatlayImg || '/assets/images/hero_studio_flatlay_1793005975591.jpg';

const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'studio-merchandise',
    client: 'Imaginedge Executive Suite',
    product: 'Branded tumblers, stationery, polo & tote',
    caption: 'Executive Merchandise Showcase',
    image: HERO_STUDIO,
  },
  {
    id: 'studio-flatlay',
    client: 'Imaginedge Premium Collection',
    product: 'Thermal flask, corporate polo, leather journal & canvas tote',
    caption: 'Premium Corporate Gifting & Merchandise',
    image: HERO_FLATLAY,
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
      className="relative m-2 sm:m-4 rounded-[28px] overflow-hidden bg-[#15171A] text-white min-h-[600px] min-h-[100svh] h-auto lg:h-[calc(100svh-32px)] flex flex-col justify-between select-none shadow-2xl pb-20 md:pb-0"
      aria-label="Hero showcase"
    >
      {/* Background Photo Slider with soft dark gradient & crystal clear merchandise showcases */}
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
              {/* Full-bleed product image - razor-sharp and crystal clear */}
              <img
                src={project.image}
                alt={project.caption}
                className="w-full h-full object-cover object-center will-change-transform filter contrast-[1.02] brightness-[1.01]"
              />
            </div>
          );
        })}
      </div>

      {/* Floating Header Clearance Spacer */}
      <div className="relative z-10 w-full pt-20 sm:pt-28" aria-hidden="true" />

      {/* Main Content Area: Centred vertically on desktop, bottom-aligned on mobile */}
      <div className="relative z-20 flex-1 flex flex-col justify-end lg:justify-center px-3 sm:px-8 lg:px-12 pb-4 sm:pb-8">
        {/* Frosted Glass Card: 28px padding on mobile, 40px top padding on desktop */}
        <div
          ref={cardRef}
          className="w-full max-w-[620px] mx-auto sm:mx-0 p-7 sm:p-10 lg:pt-10 rounded-[24px] bg-[#15171A]/70 backdrop-blur-[20px] border border-white/15 shadow-2xl"
        >
          {/* Eyebrow: 12px, letter-spacing 0.12em with 28px padding around it from card */}
          <p className="font-poppins font-semibold uppercase text-[12px] sm:text-[13px] tracking-[0.12em] sm:tracking-[0.14em] text-[#F0C020] mb-3 sm:mb-4">
            Your promotional items guru
          </p>

          {/* Headline: The single <h1> on page, accessible to screen readers & crawlers with red underline under "branded" */}
          <h1
            ref={headlineRef}
            className="font-poppins font-extrabold text-white text-[clamp(2rem,8vw,2.75rem)] lg:text-[clamp(2.35rem,4.2vw,3.75rem)] leading-[1.08] tracking-[-0.02em] max-w-[540px] [text-wrap:balance]"
          >
            {/* Screen reader and crawler readable full sentence */}
            <span className="sr-only">
              Promotional items and branded printing in Nairobi.
            </span>

            {/* Visual animated lines */}
            <span aria-hidden="true" className="block">
              <span className="block overflow-hidden">
                <span className="hero-reveal-line block">
                  Promotional items and
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-reveal-line block">
                  <span className="relative inline-block pb-1">
                    branded
                    <span
                      className="absolute left-0 bottom-0.5 w-full h-[4px] bg-[#B52026] rounded-full"
                      aria-hidden="true"
                    />
                  </span>{' '}
                  printing in Nairobi.
                </span>
              </span>
            </span>
          </h1>

          {/* Subline */}
          <p
            ref={paragraphRef}
            className="font-poppins text-white/85 text-base sm:text-[18px] leading-relaxed mt-4 sm:mt-5 max-w-xl"
          >
            We design, print and deliver garments, drinkware, banners, bags and corporate gifts for organisations and institutions.
          </p>

          {/* Buttons: full width of card on mobile, same height (52px), 12px gap, 24px space below */}
          <div
            ref={buttonsRef}
            className="mt-6 sm:mt-8 flex flex-col md:flex-row items-stretch md:items-center gap-[12px] md:gap-4 pb-6 md:pb-0"
          >
            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="w-full md:w-auto h-[52px] font-poppins font-bold text-sm text-white bg-[#B52026] hover:bg-[#9C1A1F] active:scale-[0.98] px-7 rounded-full inline-flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-red-900/40 cursor-pointer"
            >
              <span>Get a quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#selected-work"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo('#selected-work', -80);
              }}
              className="w-full md:w-auto h-[52px] font-poppins font-semibold text-sm text-white border-2 border-white/80 hover:border-white hover:bg-white/10 active:scale-[0.98] px-7 rounded-full inline-flex items-center justify-center transition-all cursor-pointer"
            >
              <span>See our work</span>
            </a>
          </div>
        </div>
      </div>

      {/* Photo Slider Controls: 16px margin (bottom-4 right-4), outside card, away from text */}
      {FEATURED_PROJECTS.length > 1 && (
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 sm:gap-3">
          {/* Slide Dots */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-full bg-[#15171A]/65 backdrop-blur-[18px] border border-white/15 shadow-lg"
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

          {/* Prev & Next 44px Arrow Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-[#15171A]/65 backdrop-blur-[18px] border border-white/15 text-white hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-lg"
              aria-label="Previous project photo"
              title="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-[#15171A]/65 backdrop-blur-[18px] border border-white/15 text-white hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-lg"
              aria-label="Next project photo"
              title="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
