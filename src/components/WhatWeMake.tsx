import React, { useRef, useEffect } from 'react';
import {
  Coffee,
  Shirt,
  Flag,
  Megaphone,
  ShoppingBag,
  Umbrella,
  BookOpen,
  Award,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WHAT_WE_MAKE_GRID } from '../data/siteContent';
import { smoothScrollTo } from '../utils/scrollHelper';
import { MOTION_CONFIG } from '../config/motionConfig';

gsap.registerPlugin(ScrollTrigger);

interface WhatWeMakeProps {
  onSelectCategory: (tabId: string) => void;
}

export const WhatWeMake: React.FC<WhatWeMakeProps> = ({ onSelectCategory }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const gridEl = gridRef.current;
    if (!sectionEl || !gridEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = gridEl.querySelectorAll<HTMLButtonElement>('.what-we-make-card');

    // Initialize SVG paths with strokeDasharray for self-drawing animation
    cards.forEach((card) => {
      const paths = card.querySelectorAll<SVGGeometryElement>(
        'svg path, svg circle, svg line, svg polyline, svg polygon, svg rect'
      );
      paths.forEach((p) => {
        try {
          const length = p.getTotalLength ? p.getTotalLength() : 120;
          p.style.strokeDasharray = `${length}`;
          p.style.strokeDashoffset = `${length}`;
        } catch {
          p.style.strokeDasharray = '120';
          p.style.strokeDashoffset = '120';
        }
      });
    });

    const mm = gsap.matchMedia();

    // DESKTOP: Stagger in cards sequentially (60ms apart)
    mm.add(MOTION_CONFIG.breakpoints.desktop, () => {
      gsap.fromTo(
        cards,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: MOTION_CONFIG.stagger.iconsDesktop,
          duration: 0.65,
          ease: MOTION_CONFIG.easing.reveal,
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              cards.forEach((card, idx) => {
                const paths = card.querySelectorAll<SVGGeometryElement>(
                  'svg path, svg circle, svg line, svg polyline, svg polygon, svg rect'
                );
                gsap.to(paths, {
                  strokeDashoffset: 0,
                  duration: 0.85,
                  delay: idx * MOTION_CONFIG.stagger.iconsDesktop,
                  ease: 'power2.out',
                });
              });
            },
          },
        }
      );
    });

    // MOBILE: Stagger in cards TWO AT A TIME with self-drawing line animation
    mm.add(MOTION_CONFIG.breakpoints.mobile, () => {
      cards.forEach((card, idx) => {
        const pairIndex = Math.floor(idx / 2);
        const pairDelay = pairIndex * MOTION_CONFIG.stagger.iconsMobile;

        gsap.fromTo(
          card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            delay: pairDelay,
            duration: 0.6,
            ease: MOTION_CONFIG.easing.reveal,
            scrollTrigger: {
              trigger: gridEl,
              start: 'top 88%',
              once: true,
              onEnter: () => {
                const paths = card.querySelectorAll<SVGGeometryElement>(
                  'svg path, svg circle, svg line, svg polyline, svg polygon, svg rect'
                );
                gsap.to(paths, {
                  strokeDashoffset: 0,
                  duration: 0.8,
                  delay: pairDelay + 0.1,
                  ease: 'power2.out',
                });
              },
            },
          }
        );
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  const renderIcon = (iconName: string) => {
    const iconProps = {
      className: 'w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[1.4]',
    };

    switch (iconName) {
      case 'Coffee':
        return <Coffee {...iconProps} />;
      case 'Shirt':
        return <Shirt {...iconProps} />;
      case 'Flag':
        return <Flag {...iconProps} />;
      case 'Megaphone':
        return <Megaphone {...iconProps} />;
      case 'ShoppingBag':
        return <ShoppingBag {...iconProps} />;
      case 'Umbrella':
        return <Umbrella {...iconProps} />;
      case 'BookOpen':
        return <BookOpen {...iconProps} />;
      case 'Award':
        return <Award {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  const handleItemClick = (galleryTabId: string) => {
    onSelectCategory(galleryTabId);
    smoothScrollTo('#selected-work', -80);
  };

  return (
    <section
      ref={sectionRef}
      id="what-we-make"
      className="relative w-full bg-crimson bg-crimson-pattern text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-white/70 block mb-2">
              Capabilities & Products
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              What we make.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/80 max-w-md font-light">
            Click any promotional category to explore specifications, finished client projects, and
            request direct bulk pricing.
          </p>
        </div>

        {/* 4-Column Grid (1 col on mobile, 2 cols on small tablet, 4 cols on desktop) with self-drawing icons */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
        >
          {WHAT_WE_MAKE_GRID.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.galleryTabId)}
              className="what-we-make-card group relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-2xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 transition-all duration-300 text-center cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white will-change-transform min-h-[220px] shadow-sm hover:shadow-lg hover:shadow-black/20"
            >
              {/* Main content: Icon, Title & Items list */}
              <div className="flex flex-col items-center w-full">
                {/* Icon Container: Lifts on hover */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/[0.09] group-hover:bg-crimson-deep flex items-center justify-center transition-all duration-300 mb-4 shadow-inner group-hover:-translate-y-1 group-hover:scale-105 border border-white/10">
                  {renderIcon(item.iconName)}
                </div>

                {/* Title with label underline on hover */}
                <h3 className="relative text-base sm:text-lg font-bold text-white tracking-tight">
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full" />
                </h3>

                {/* Product items description */}
                <p className="text-xs sm:text-[13px] text-white/80 mt-2.5 leading-relaxed text-center group-hover:text-white transition-colors max-w-[260px]">
                  {item.countLabel}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
