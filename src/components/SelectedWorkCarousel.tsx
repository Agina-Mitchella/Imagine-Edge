import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shirt,
  Flag,
  ShoppingBag,
  Briefcase,
  Sparkles,
  Package,
  FileText,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SELECTED_WORK_CARDS, SelectedWorkCard } from '../data/siteContent';

gsap.registerPlugin(ScrollTrigger);

interface SelectedWorkCarouselProps {
  onOpenLightbox: (item: {
    title: string;
    client: string;
    specs: string;
    image: string;
    images?: string[];
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

  const touchStartY = useRef(0);
  const isHorizontalTouch = useRef<boolean | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);

  // Letters for stacked fit-text heading
  const LINE1_LETTERS = ['S', 'E', 'L', 'E', 'C', 'T', 'E', 'D'];
  const LINE2_LETTERS = ['W', 'O', 'R', 'K'];

  // Heading Fit-Text & Motion Refs & State
  const headingContainerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line1DriftRef = useRef<HTMLDivElement>(null);
  const line2DriftRef = useRef<HTMLDivElement>(null);
  const measureLine1Ref = useRef<HTMLSpanElement>(null);
  const measureLine2Ref = useRef<HTMLSpanElement>(null);

  const [fontSizes, setFontSizes] = useState({
    line1: 68,
    line2: 120,
  });
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeLetter, setActiveLetter] = useState<{ line: 1 | 2; index: number } | null>(null);

  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouchInteraction = useRef(false);

  // Fit-Text calculation function: scales line 1 and line 2 to exact container width
  const calculateFitSizes = () => {
    const container = headingContainerRef.current;
    const m1 = measureLine1Ref.current;
    const m2 = measureLine2Ref.current;
    if (!container || !m1 || !m2) return;

    const containerWidth = container.clientWidth;
    if (containerWidth <= 0) return;

    const w1 = m1.getBoundingClientRect().width;
    const w2 = m2.getBoundingClientRect().width;

    if (w1 > 0 && w2 > 0) {
      setFontSizes({
        line1: (containerWidth / w1) * 100,
        line2: (containerWidth / w2) * 100,
      });
    }
  };

  useEffect(() => {
    calculateFitSizes();

    // Recalculate once Poppins web font has loaded
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        calculateFitSizes();
      });
    }

    const container = headingContainerRef.current;
    let ro: ResizeObserver | null = null;
    if (container && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        calculateFitSizes();
      });
      ro.observe(container);
    }

    const handleResize = () => {
      calculateFitSizes();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Heading GSAP Entrance & Drift animations
  useEffect(() => {
    const container = headingContainerRef.current;
    const sectionEl = sectionRef.current;
    if (!container || !sectionEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Entrance animation: letters slide up from behind mask, staggered 40ms
      const letters = container.querySelectorAll('.heading-reveal-letter');
      if (letters.length > 0) {
        gsap.fromTo(
          letters,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.04, // 40ms
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              once: true,
            },
            onComplete: () => {
              setIsRevealed(true);
            },
          }
        );
      }

      // 2. Scroll drift: Line 1 drifts left and Line 2 drifts right (~6% width)
      if (line1DriftRef.current) {
        gsap.fromTo(
          line1DriftRef.current,
          { xPercent: 3 },
          {
            xPercent: -3,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }

      if (line2DriftRef.current) {
        gsap.fromTo(
          line2DriftRef.current,
          { xPercent: -3 },
          {
            xPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Hover and Tap handlers for letter lift and color change
  const handleLetterTap = (line: 1 | 2, index: number) => {
    isTouchInteraction.current = true;
    setActiveLetter({ line, index });
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    tapTimeoutRef.current = setTimeout(() => {
      setActiveLetter(null);
      isTouchInteraction.current = false;
    }, 750);
  };

  const handleMouseEnter = (line: 1 | 2, index: number) => {
    if (isTouchInteraction.current) return;
    setActiveLetter({ line, index });
  };

  const handleMouseLeave = () => {
    if (isTouchInteraction.current) return;
    setActiveLetter(null);
  };

  const filterOptions = [
    'All',
    'Garments',
    'Drinkware',
    'Banners',
    'Bags',
    'Packaging',
    'Desk items',
    'Print & stationery',
  ];

  const filteredCards = (
    selectedFilter === 'All'
      ? SELECTED_WORK_CARDS
      : SELECTED_WORK_CARDS.filter((c) => c.filterCategory === selectedFilter)
  ).filter((c) => Boolean(c.image && c.image.trim() !== ''));

  // Helper to calculate exact scroll distance per card (card width + 20px gap)
  const getScrollStep = () => {
    const track = cardsTrackRef.current;
    const firstCard = track?.querySelector<HTMLElement>('.selected-work-card');
    return firstCard ? firstCard.offsetWidth + 20 : (window.innerWidth < 640 ? 280 : 320);
  };

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

    // Active card index based on dynamic card step
    const cardStep = getScrollStep();
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

  // Drag Carousel Mouse Handlers (Desktop click & drag)
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
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    cardsTrackRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Mobile fast interactive touch tracking (leaves momentum to GPU while preventing click on swipe)
  const isSwipingRef = useRef(false);

  const handleTouchStart = () => {
    isSwipingRef.current = false;
  };

  const handleTouchMove = () => {
    isSwipingRef.current = true;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 100);
  };

  const scrollByAmount = (offset: number) => {
    if (cardsTrackRef.current) {
      cardsTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleCardClick = (card: SelectedWorkCard) => {
    if (hasDragged || isSwipingRef.current) return;
    onOpenLightbox({
      title: card.title,
      client: card.client,
      specs: card.specs || '',
      image: card.image || '',
      images: card.images,
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
      case 'packaging':
        return <Package {...iconProps} />;
      case 'desk items':
        return <Briefcase {...iconProps} />;
      case 'print & stationery':
        return <FileText {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="selected-work"
      data-header-theme="light"
      className="relative w-full bg-offwhite text-charcoal py-[48px] md:py-[72px] overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hidden Measurer for Exact Fit-Text Widths */}
        <div
          aria-hidden="true"
          className="absolute opacity-0 pointer-events-none -z-50 select-none uppercase font-poppins font-extrabold whitespace-nowrap"
          style={{
            fontSize: '100px',
            letterSpacing: '-0.04em',
            lineHeight: '0.85',
            left: '-9999px',
            top: '-9999px',
            visibility: 'hidden',
          }}
        >
          <span ref={measureLine1Ref} className="inline-block whitespace-nowrap">
            SELECTED
          </span>
          <span ref={measureLine2Ref} className="inline-block whitespace-nowrap">
            WORK
          </span>
        </div>

        {/* Redesigned Stacked Fit-Text Heading */}
        <h2 className="relative w-full mb-8 sm:mb-12 font-poppins font-extrabold uppercase select-none">
          <span className="sr-only">SELECTED WORK</span>

          <div
            ref={headingContainerRef}
            aria-hidden="true"
            className="w-full flex flex-col overflow-hidden"
          >
            {/* Line 1: SELECTED - solid charcoal #15171A, drifts left on scroll */}
            <div
              ref={line1DriftRef}
              className="w-full will-change-transform"
              style={{ transformOrigin: 'left center' }}
            >
              <div
                ref={line1Ref}
                className="w-full flex justify-between items-baseline whitespace-nowrap font-poppins font-extrabold tracking-[-0.04em] leading-[0.85]"
                style={{
                  fontSize: `${fontSizes.line1}px`,
                  color: '#15171A',
                }}
              >
                {LINE1_LETTERS.map((letter, idx) => {
                  const isActive = activeLetter?.line === 1 && activeLetter?.index === idx;
                  const isNeighbour =
                    activeLetter?.line === 1 && Math.abs(activeLetter.index - idx) === 1;

                  const translateY = isActive ? -12 : isNeighbour ? -6 : 0;
                  const letterColor = isActive ? '#B52026' : '#15171A';

                  return (
                    <span
                      key={idx}
                      className={`relative inline-block ${
                        isRevealed ? 'overflow-visible' : 'overflow-hidden'
                      } py-2 -my-2`}
                      onMouseEnter={() => handleMouseEnter(1, idx)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleLetterTap(1, idx)}
                      onTouchStart={() => handleLetterTap(1, idx)}
                    >
                      <span className="heading-reveal-letter inline-block will-change-transform">
                        <span
                          className="heading-interactive-letter inline-block select-none cursor-pointer"
                          style={{
                            transform: `translateY(${translateY}px)`,
                            color: letterColor,
                            transition:
                              'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease',
                            willChange: 'transform, color',
                          }}
                        >
                          {letter}
                        </span>
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Line 2: WORK - outline only (2px stroke #921B1D, transparent fill), drifts right on scroll */}
            <div
              ref={line2DriftRef}
              className="w-full will-change-transform"
              style={{ transformOrigin: 'right center' }}
            >
              <div
                ref={line2Ref}
                className="w-full flex justify-between items-baseline whitespace-nowrap font-poppins font-extrabold tracking-[-0.04em] leading-[0.85]"
                style={{
                  fontSize: `${fontSizes.line2}px`,
                }}
              >
                {LINE2_LETTERS.map((letter, idx) => {
                  const isActive = activeLetter?.line === 2 && activeLetter?.index === idx;
                  const isNeighbour =
                    activeLetter?.line === 2 && Math.abs(activeLetter.index - idx) === 1;

                  const translateY = isActive ? -12 : isNeighbour ? -6 : 0;
                  const strokeColor = isActive ? '#B52026' : '#921B1D';
                  const fillColor = isActive ? '#B52026' : 'transparent';

                  return (
                    <span
                      key={idx}
                      className={`relative inline-block ${
                        isRevealed ? 'overflow-visible' : 'overflow-hidden'
                      } py-2 -my-2`}
                      onMouseEnter={() => handleMouseEnter(2, idx)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleLetterTap(2, idx)}
                      onTouchStart={() => handleLetterTap(2, idx)}
                    >
                      <span className="heading-reveal-letter inline-block will-change-transform">
                        <span
                          className="heading-interactive-letter inline-block select-none cursor-pointer"
                          style={{
                            transform: `translateY(${translateY}px)`,
                            WebkitTextStroke: `2px ${strokeColor}`,
                            color: fillColor,
                            transition:
                              'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease, -webkit-text-stroke-color 0.2s ease',
                            willChange: 'transform, color',
                          }}
                        >
                          {letter}
                        </span>
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </h2>

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

          {/* Prev/Next Arrows: aligned on the right, disabled at edges, touch-friendly */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByAmount(-getScrollStep())}
              disabled={isAtStart}
              aria-label="Previous items"
              className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] rounded-full bg-white border border-[#E8E1DA] flex items-center justify-center transition-opacity text-charcoal hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(getScrollStep())}
              disabled={isAtEnd}
              aria-label="Next items"
              className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] rounded-full bg-white border border-[#E8E1DA] flex items-center justify-center transition-opacity text-charcoal hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Drag & Fast Momentum Carousel Track: 20px gap between cards */}
        <div
          ref={cardsTrackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{ WebkitOverflowScrolling: 'touch' }}
          className={`flex items-stretch gap-[20px] overflow-x-auto no-scrollbar scroll-smooth py-3 px-1 will-change-scroll overscroll-x-contain snap-x snap-mandatory sm:snap-none ${
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
              className="selected-work-card group shrink-0 flex flex-col rounded-[16px] overflow-hidden bg-white border border-[#EEEAE5] shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] active:scale-[0.985] transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red snap-start select-none cursor-pointer"
            >
              {/* Square (1:1) Image Frame, pure white #FFFFFF background, 12px padding, image centred */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#FFFFFF] border-b border-[#EEEAE5] flex items-center justify-center p-[12px]">
                {card.badge && (
                  <span className="absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded-full bg-[#15171A]/85 backdrop-blur-xs text-white text-[11px] font-medium font-poppins shadow-sm">
                    {card.badge}
                  </span>
                )}
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Text Block: 16px padding. Category: 11px uppercase #B52026, title: 16px Poppins SemiBold, max two lines */}
              <div className="p-4 flex flex-col justify-center bg-white">
                <span className="text-[11px] font-medium font-poppins uppercase tracking-[0.08em] text-[#B52026] mb-1 block">
                  {card.category}
                </span>
                <h3 className="text-[16px] font-semibold font-poppins text-[#1B1416] leading-[1.3] line-clamp-2 m-0 p-0">
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
