import React, { useRef, useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GALLERY_TABS, GalleryItem } from '../data/siteContent';
import { MOTION_CONFIG } from '../config/motionConfig';

gsap.registerPlugin(ScrollTrigger);

interface TabbedGalleryProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenLightbox: (item: {
    title: string;
    client: string;
    specs: string;
    image: string;
    materials?: string;
    category?: string;
    leadTime?: string;
  }) => void;
  onOpenQuote: (category?: string) => void;
}

export const TabbedGallery: React.FC<TabbedGalleryProps> = ({
  activeTab,
  onTabChange,
  onOpenLightbox,
  onOpenQuote,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const currentTab = GALLERY_TABS.find((t) => t.id === activeTab) || GALLERY_TABS[0];

  // Update sliding red underline position
  useEffect(() => {
    const tabsList = tabsListRef.current;
    if (!tabsList) return;

    const activeButton = tabsList.querySelector<HTMLButtonElement>(`[data-tab-id="${activeTab}"]`);
    if (activeButton) {
      const left = activeButton.offsetLeft;
      const width = activeButton.offsetWidth;
      setUnderlineStyle({ left, width, opacity: 1 });

      // Ensure active tab is scrolled into view comfortably on mobile
      const scrollOffset = left - tabsList.offsetWidth / 2 + width / 2;
      tabsList.scrollTo({ left: Math.max(0, scrollOffset), behavior: 'smooth' });
    }
  }, [activeTab]);

  // Section entrance animation
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cards reveal with clip-path curtain and inner image parallax via gsap.matchMedia
  useEffect(() => {
    const cardsGrid = cardsGridRef.current;
    if (!cardsGrid) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = cardsGrid.querySelectorAll<HTMLDivElement>('.gallery-card');
    const innerImages = cardsGrid.querySelectorAll<HTMLImageElement>('.gallery-card-inner-img');

    // 1. Clip-path curtain reveal for cards
    gsap.fromTo(
      cards,
      { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 15 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto',
      }
    );

    // 2. Inner image parallax with matchMedia (5% on mobile, 10% on desktop)
    const mm = gsap.matchMedia();

    mm.add(MOTION_CONFIG.breakpoints.desktop, () => {
      innerImages.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.gallery-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    });

    mm.add(MOTION_CONFIG.breakpoints.mobile, () => {
      innerImages.forEach((img) => {
        // Inner image parallax at about 5% on mobile
        gsap.fromTo(
          img,
          { yPercent: 3 },
          {
            yPercent: -3,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.gallery-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    });

    return () => {
      mm.revert();
    };
  }, [activeTab]);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  const handleCardClick = (item: GalleryItem) => {
    onOpenLightbox({
      title: item.title,
      client: item.client,
      specs: item.specs,
      image: item.image,
      materials: item.materials,
      category: item.categoryLabel,
      leadTime: item.leadTime,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="tabbed-gallery"
      className="relative w-full bg-charcoal text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-left mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-red mb-1.5 block">
            Product Showcase & Gallery
          </span>
          <h2
            ref={headingRef}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            We make things worth branding.
          </h2>
        </div>

        {/* Short Intro and Contact Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-5 border-b border-white/10">
          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-2xl leading-relaxed">
            {currentTab.description}
          </p>
          <button
            type="button"
            onClick={() => onOpenQuote(currentTab.name)}
            className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-red hover:bg-red-hover text-white transition-all shadow-sm active:scale-95 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Contact us for {currentTab.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Bar: Scrolls horizontally on mobile with sliding red underline */}
        <div className="relative mb-6 sm:mb-8 border-b border-white/10 pb-1">
          <div
            ref={tabsListRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth relative py-1 px-1"
          >
            {GALLERY_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  data-tab-id={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabClick(tab.id)}
                  className={`shrink-0 px-4 py-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[44px] rounded-t-lg relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}

            {/* Sliding Red Underline Indicator */}
            <div
              ref={underlineRef}
              className="absolute bottom-0 h-0.5 bg-red transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
                opacity: underlineStyle.opacity,
              }}
            />
          </div>
        </div>

        {/* Cards Grid: Curtain reveal + inner image parallax */}
        <div
          ref={cardsGridRef}
          id={`panel-${currentTab.id}`}
          role="tabpanel"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {currentTab.items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(item);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${item.title}`}
              className="gallery-card group flex flex-col rounded-xl overflow-hidden bg-[#181B20] border border-white/10 hover:border-white/25 active:border-red transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red will-change-transform"
            >
              {/* Image slot with inner image parallax */}
              <div className="relative h-[220px] sm:h-[240px] w-full overflow-hidden bg-[#121519] border-b border-white/10 flex items-center justify-center p-3 sm:p-4">
                <img
                  src={item.image}
                  alt={`${item.title} for ${item.client}`}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="gallery-card-inner-img max-h-full max-w-full w-auto h-auto object-contain object-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.03]"
                />
              </div>

              {/* Information Below Image */}
              <div className="p-4 sm:p-4.5 flex flex-col space-y-1 bg-[#181B20]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red">
                  {item.client}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug line-clamp-1 group-hover:text-slate-100 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 font-normal leading-relaxed line-clamp-2 pt-0.5">
                  {item.specs}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
