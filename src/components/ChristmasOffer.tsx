export const OFFER_END_DATE = "YYYY-MM-DD";
export const STORE_ADDRESS = "";

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ZoomIn } from 'lucide-react';
import { smoothScrollTo } from '../utils/scrollHelper';

export const isOfferActive = (endDateStr: string = OFFER_END_DATE): boolean => {
  if (!endDateStr || endDateStr === 'YYYY-MM-DD') return true;
  const targetDate = new Date(`${endDateStr}T23:59:59`);
  if (isNaN(targetDate.getTime())) return true;
  return Date.now() <= targetDate.getTime();
};

export interface ChristmasOfferProps {
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
  onOpenQuote?: (category?: string) => void;
}

export const ChristmasAnnouncementBar: React.FC<{
  onVisibilityChange?: (visible: boolean) => void;
}> = ({ onVisibilityChange }) => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const active = isOfferActive(OFFER_END_DATE);
    const wasDismissed = sessionStorage.getItem('christmas_bar_dismissed') === 'true';
    const isVisible = active && !wasDismissed;
    setDismissed(!isVisible);
    onVisibilityChange?.(isVisible);
  }, [onVisibilityChange]);

  const handleDismiss = () => {
    sessionStorage.setItem('christmas_bar_dismissed', 'true');
    setDismissed(true);
    onVisibilityChange?.(false);
  };

  const handleSeeOffer = (e: React.MouseEvent) => {
    e.preventDefault();
    smoothScrollTo('#christmas-offer');
  };

  if (dismissed || !isOfferActive(OFFER_END_DATE)) return null;

  return (
    <aside
      role="banner"
      aria-label="Christmas sale announcement"
      className="fixed top-0 inset-x-0 h-[40px] z-50 bg-[#921B1D] text-white flex items-center justify-between px-3 sm:px-6 font-poppins text-xs shadow-md select-none"
    >
      <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-3 text-center overflow-hidden">
        <span className="truncate font-medium text-[11px] sm:text-xs md:text-sm tracking-wide">
          End of year Christmas sale: T-shirts and polo shirts.
        </span>
        <a
          href="#christmas-offer"
          onClick={handleSeeOffer}
          className="inline-flex items-center gap-1 underline font-semibold hover:text-white/80 transition-colors cursor-pointer shrink-0 text-[11px] sm:text-xs md:text-sm"
        >
          <span>See the offer</span>
          <ArrowRight className="w-3 h-3 hidden sm:inline" />
        </a>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Close Christmas sale announcement"
        className="p-1 rounded-md hover:bg-white/15 text-white/90 hover:text-white transition-colors cursor-pointer shrink-0 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};

export const ChristmasOfferSection: React.FC<ChristmasOfferProps> = ({
  onOpenLightbox,
}) => {
  if (!isOfferActive(OFFER_END_DATE)) {
    return null;
  }

  const handleOpenTShirts = () => {
    onOpenLightbox({
      title: 'T-shirts',
      client: 'Imaginedge Solutions',
      specs: 'End of year Christmas sale',
      image: '/assets/aistudio/e937793d-9899-4345-aad8-50eb57d01a84_4f762e61.jpeg',
    });
  };

  const handleOpenPolos = () => {
    onOpenLightbox({
      title: 'Polo shirts',
      client: 'Imaginedge Solutions',
      specs: 'End of year Christmas sale',
      image: '/assets/aistudio/fdef8f92-e39c-4d36-a846-8b88897afa40_bf8aea96.jpeg',
    });
  };

  return (
    <section
      id="christmas-offer"
      data-header-theme="light"
      className="w-full bg-[#FBF6F1] py-10 md:py-[56px] font-poppins text-[#1B1416] scroll-mt-14"
      aria-labelledby="christmas-offer-heading"
    >
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6">
        {/* Heading & Subline */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <h2
            id="christmas-offer-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B1416] tracking-tight leading-tight"
          >
            End of year Christmas sale
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-[#1B1416]/80 font-normal">
            T-shirts and polo shirts. Order on WhatsApp.
          </p>
        </div>

        {/* Two cards side by side with a 24px gap, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Card 1: T-shirts */}
          <div className="bg-white rounded-[16px] border border-[#EEEAE5] p-5 flex flex-col shadow-xs">
            {/* Flyer image: maximum height of min(520px, 65svh) on desktop and min(440px, 60svh) on mobile */}
            <div
              className="relative w-full h-[min(440px,60svh)] md:h-[min(520px,65svh)] max-h-[min(440px,60svh)] md:max-h-[min(520px,65svh)] bg-white rounded-lg flex items-center justify-center p-3 cursor-pointer group select-none"
              onClick={handleOpenTShirts}
              role="button"
              tabIndex={0}
              aria-label="Open T-shirts flyer in full size"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenTShirts();
                }
              }}
            >
              <img
                src="/assets/aistudio/e937793d-9899-4345-aad8-50eb57d01a84_4f762e61.jpeg"
                alt="T-shirts Christmas sale flyer"
                className="max-h-full w-auto max-w-full object-contain object-center transition-transform duration-200 group-hover:scale-[1.01]"
                loading="lazy"
              />

              {/* Small magnifier icon in the corner */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenTShirts();
                }}
                aria-label="View full-size T-shirts flyer"
                className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-[#1B1416] border border-[#E8E1DA] shadow-xs flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026]"
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1B1416]" />
              </button>
            </div>

            {/* Title below: T-shirts (Poppins SemiBold, 20px) */}
            <h3 className="font-poppins font-semibold text-[20px] text-[#1B1416] mt-4 mb-3">
              T-shirts
            </h3>

            {/* Solid #B52026 pill button with WhatsApp icon */}
            <a
              href="https://wa.me/254710428485?text=Hi%20Imaginedge,%20I'd%20like%20to%20order%20T-shirts."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[46px] rounded-full bg-[#B52026] hover:bg-[#921B1D] text-white font-poppins font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors shadow-xs active:scale-[0.99] cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
              </svg>
              <span>Order on WhatsApp</span>
            </a>
          </div>

          {/* Card 2: Polo shirts */}
          <div className="bg-white rounded-[16px] border border-[#EEEAE5] p-5 flex flex-col shadow-xs">
            {/* Flyer image: maximum height of min(520px, 65svh) on desktop and min(440px, 60svh) on mobile */}
            <div
              className="relative w-full h-[min(440px,60svh)] md:h-[min(520px,65svh)] max-h-[min(440px,60svh)] md:max-h-[min(520px,65svh)] bg-white rounded-lg flex items-center justify-center p-3 cursor-pointer group select-none"
              onClick={handleOpenPolos}
              role="button"
              tabIndex={0}
              aria-label="Open Polo shirts flyer in full size"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenPolos();
                }
              }}
            >
              <img
                src="/assets/aistudio/fdef8f92-e39c-4d36-a846-8b88897afa40_bf8aea96.jpeg"
                alt="Polo shirts Christmas sale flyer"
                className="max-h-full w-auto max-w-full object-contain object-center transition-transform duration-200 group-hover:scale-[1.01]"
                loading="lazy"
              />

              {/* Small magnifier icon in the corner */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPolos();
                }}
                aria-label="View full-size Polo shirts flyer"
                className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-[#1B1416] border border-[#E8E1DA] shadow-xs flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026]"
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1B1416]" />
              </button>
            </div>

            {/* Title below: Polo shirts (Poppins SemiBold, 20px) */}
            <h3 className="font-poppins font-semibold text-[20px] text-[#1B1416] mt-4 mb-3">
              Polo shirts
            </h3>

            {/* Solid #B52026 pill button with WhatsApp icon */}
            <a
              href="https://wa.me/254710428485?text=Hi%20Imaginedge,%20I'd%20like%20to%20order%20polo%20shirts."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[46px] rounded-full bg-[#B52026] hover:bg-[#921B1D] text-white font-poppins font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors shadow-xs active:scale-[0.99] cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
              </svg>
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
