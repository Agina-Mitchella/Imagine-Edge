import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shirt,
  Flag,
  ShoppingBag,
  Umbrella,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import gsap from 'gsap';
import { SELECTED_WORK_CARDS, SelectedWorkCard } from '../data/siteContent';

interface SelectedWorkCarouselProps {
  onOpenLightbox: (item: {
    title: string;
    client: string;
    specs: string;
    image: string;
    materials?: string;
    category?: string;
    leadTime?: string;
  }) => void;
}

export const SelectedWorkCarousel: React.FC<SelectedWorkCarouselProps> = ({ onOpenLightbox }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);

  const filterOptions = [
    'All',
    'Garments',
    'Drinkware',
    'Banners',
    'Bags',
    'Umbrellas',
    'Desk items',
  ];

  const filteredCards =
    selectedFilter === 'All'
      ? SELECTED_WORK_CARDS
      : SELECTED_WORK_CARDS.filter((c) => c.filterCategory === selectedFilter);

  // Monitor scroll position to update arrows and progress counter
  const updateScrollState = () => {
    const track = cardsTrackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;

    setIsAtStart(scrollLeft <= 8);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 12);

    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)) : 100;
    setProgressPercent(progress);

    // Approximate active card count
    const cardStep = window.innerWidth < 640 ? 324 : 404; // width + gap
    const index = Math.min(
      filteredCards.length,
      Math.max(1, Math.round(scrollLeft / cardStep) + 1)
    );
    setVisibleIndex(index);
  };

  useEffect(() => {
    updateScrollState();
    const track = cardsTrackRef.current;
    if (track) {
      track.addEventListener('scroll', updateScrollState, { passive: true });
      window.addEventListener('resize', updateScrollState);
      return () => {
        track.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, [filteredCards]);

  // Reset scroll and animate cards when filter changes
  useEffect(() => {
    if (cardsTrackRef.current) {
      cardsTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    const track = cardsTrackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll('.selected-work-card');
    gsap.fromTo(
      cards,
      { y: 12, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );
  }, [selectedFilter]);

  // Drag Carousel Mouse Handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardsTrackRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - cardsTrackRef.current.offsetLeft);
    setScrollLeftState(cardsTrackRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !cardsTrackRef.current) return;
    e.preventDefault();
    const x = e.pageX - cardsTrackRef.current.offsetLeft;
    const walk = (x - startX) * 1.35;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    cardsTrackRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scrollByAmount = (offset: number) => {
    if (cardsTrackRef.current) {
      cardsTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleCardClick = (card: SelectedWorkCard) => {
    if (hasDragged) return;
    onOpenLightbox({
      title: card.title,
      client: card.client,
      specs: card.specs || '',
      image: card.image || '',
      category: card.category,
      materials: card.materials,
      leadTime: card.leadTime,
    });
  };

  const renderCategoryIcon = (category: string) => {
    const iconProps = {
      className: 'w-14 h-14',
      stroke: '#921B1D',
      strokeWidth: 1.25,
      strokeOpacity: 0.4,
    };

    switch (category.toLowerCase()) {
      case 'garments':
        return <Shirt {...iconProps} />;
      case 'drinkware':
        return (
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#921B1D"
            strokeWidth="1.25"
            strokeOpacity="0.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 2h10l-1 4H8L7 2z" />
            <path d="M8 6v12a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V6" />
            <line x1="6" y1="11" x2="18" y2="11" />
          </svg>
        );
      case 'banners':
        return <Flag {...iconProps} />;
      case 'bags':
        return <ShoppingBag {...iconProps} />;
      case 'umbrellas':
        return <Umbrella {...iconProps} />;
      case 'desk items':
        return <Briefcase {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="selected-work"
      className="relative w-full bg-offwhite text-charcoal py-[64px] lg:py-[96px] overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Heading to the same grid edge as the cards */}
        <div className="mb-8 sm:mb-10 text-left">
          <span className="text-[12px] font-medium font-poppins uppercase tracking-widest text-[#B52026] mb-2 block">
            Selected work
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins text-charcoal tracking-tight leading-tight">
            Crafted in Nairobi for leading brands.
          </h2>
        </div>

        {/* Filter Row & Carousel Arrow Controls */}
        <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10">
          {/* Filter Chips (14px Poppins Medium, 10px 18px padding, pill shape, white with 1px #E8E1DA border) */}
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full"
            role="toolbar"
            aria-label="Filter selected work by category"
          >
            {filterOptions.map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-[18px] py-[10px] rounded-full text-[14px] font-medium font-poppins whitespace-nowrap cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red ${
                    isActive
                      ? 'bg-[#B52026] text-white border border-[#B52026]'
                      : 'bg-white text-charcoal border border-[#E8E1DA] hover:bg-slate-50'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Prev/Next Arrows: 44px circles, white with thin border, aligned on the right, disabled at edges */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByAmount(-404)}
              disabled={isAtStart}
              aria-label="Previous items"
              className="w-[44px] h-[44px] rounded-full bg-white border border-[#E8E1DA] flex items-center justify-center transition-opacity text-charcoal hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(404)}
              disabled={isAtEnd}
              aria-label="Next items"
              className="w-[44px] h-[44px] rounded-full bg-white border border-[#E8E1DA] flex items-center justify-center transition-opacity text-charcoal hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drag Carousel Track: 24px gap between cards, next card peeking at right edge */}
        <div
          ref={cardsTrackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-stretch gap-[24px] overflow-x-auto no-scrollbar scroll-smooth py-3 px-1 will-change-scroll ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
        >
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              tabIndex={0}
              role="button"
              aria-label={`View ${card.title}`}
              className="selected-work-card group w-[300px] sm:w-[380px] shrink-0 flex flex-col rounded-[16px] overflow-hidden bg-white border border-[#E8E1DA] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.09)] transition-all duration-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            >
              {/* 4:5 Showcase Slot: Fits entire product cleanly with zero clipping and high clarity */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E8E1DA]/60 flex items-center justify-center p-3 sm:p-4">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full w-auto h-auto object-contain object-center drop-shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  /* Designed placeholder: soft warm-grey (#EFE9E3), faint tribal pattern at 6% opacity, thin-line icon */
                  <div className="w-full h-full relative flex items-center justify-center bg-[#EFE9E3]">
                    <div
                      className="absolute inset-0 pointer-events-none opacity-[0.06]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L30 20 L20 10 L10 20 L0 20 Z M20 20 L40 40 L30 40 L20 30 L10 40 L0 40 Z' fill='%23921B1D' /%3E%3C/svg%3E")`,
                        backgroundSize: '36px 36px',
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-center">
                      {renderCategoryIcon(card.category)}
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Text Block: 20px padding, category in 12px uppercase Poppins Medium, title in 18px Poppins SemiBold */}
              <div className="p-[20px] flex flex-col justify-center bg-white">
                <span className="text-[12px] font-medium font-poppins uppercase tracking-wider text-[#B52026] mb-1.5 block">
                  {card.category}
                </span>
                <h3 className="text-[18px] font-semibold font-poppins text-[#1B1416] leading-snug line-clamp-2">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Counter & Thin Progress Line Beneath Carousel */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 font-poppins text-[14px]">
          <span>
            Showing {visibleIndex} / {filteredCards.length} items
          </span>
          <div className="w-full sm:w-56 h-[2px] bg-[#E8E1DA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B52026] rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
