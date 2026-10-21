import React, { useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GALLERY_TABS, GalleryItem } from '../data/siteContent';

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
  const cardsGridRef = useRef<HTMLDivElement>(null);

  const currentTab = GALLERY_TABS.find((t) => t.id === activeTab) || GALLERY_TABS[0];

  // Subtle entrance animation on scroll
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
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

  // Stagger in cards when active tab changes
  useEffect(() => {
    const cardsGrid = cardsGridRef.current;
    if (!cardsGrid) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = cardsGrid.querySelectorAll<HTMLDivElement>('.gallery-card');

    gsap.fromTo(
      cards,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );
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
      className="relative w-full bg-charcoal text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* 1. Compact, Left-Aligned Section Heading with small label above */}
        <div className="text-left mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-red mb-1.5 block">
            Product showcase
          </span>
          <h2
            ref={headingRef}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            We make things worth branding.
          </h2>
        </div>

        {/* 2. Short Intro and Contact Button together in one simple row beneath heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-5 border-b border-white/10">
          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-2xl leading-relaxed">
            {currentTab.description}
          </p>
          <button
            type="button"
            onClick={() => onOpenQuote(currentTab.name)}
            className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-red hover:bg-red-hover text-white transition-all shadow-sm active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Contact us for {currentTab.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. Small, Understated Filter Pills on a separate row (Clean horizontal scroll on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-6 sm:mb-8">
          {GALLERY_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(tab.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red ${
                  isActive
                    ? 'bg-red text-white shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* 4 & 5. Compact Portfolio Cards: 3-column desktop grid, 220–260px image height, restrained padding */}
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
              className="gallery-card group flex flex-col rounded-xl overflow-hidden bg-[#181B20] border border-white/10 hover:border-white/25 transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            >
              {/* Image: Compact 220–240px showcase slot that fits cleanly with high clarity */}
              <div className="relative h-[220px] sm:h-[240px] w-full overflow-hidden bg-[#121519] border-b border-white/10 flex items-center justify-center p-3 sm:p-4">
                <img
                  src={item.image}
                  alt={`${item.title} for ${item.client}`}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full w-auto h-auto object-contain object-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Information Below Image: Client name, product title, one short description with compact padding */}
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
