import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxItem {
  title: string;
  client: string;
  specs: string;
  image: string;
  images?: string[];
  materials?: string;
  category?: string;
  leadTime?: string;
}

interface LightboxModalProps {
  item: LightboxItem | null;
  onClose: () => void;
  onRequestQuote?: (itemTitle: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const imagesList = item ? (item.images && item.images.length > 0 ? item.images : [item.image]) : [];
  const hasMultiple = imagesList.length > 1;

  useEffect(() => {
    setCurrentIndex(0);
  }, [item]);

  const handlePrev = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1));
  };

  const handleNext = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && item) {
        onClose();
      } else if (hasMultiple) {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, hasMultiple, imagesList.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  if (!item) return null;

  const currentImage = imagesList[currentIndex] || item.image;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-[#EEEAE5] rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#1B1416] border border-[#E8E1DA] shadow-md flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026] cursor-pointer"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Container with Full Uncropped Image and Gallery Controls on White Background */}
        <div
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-auto min-h-[320px] sm:min-h-[460px] md:min-h-[560px] bg-white overflow-hidden flex items-center justify-center p-4 sm:p-8 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {currentImage ? (
            <img
              key={currentImage}
              src={currentImage}
              alt={`${item.title} ${hasMultiple ? `- photo ${currentIndex + 1}` : ''}`}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto max-w-full object-contain object-center drop-shadow-md transition-opacity duration-200"
            />
          ) : (
            <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center p-8 text-center text-charcoal">
              <span className="text-base sm:text-lg font-bold font-mono tracking-wide text-slate-700">
                {item.title.split(',')[0]}
              </span>
              <span className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">
                Photo Placeholder
              </span>
            </div>
          )}

          {hasMultiple && (
            <>
              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#1B1416] border border-[#E8E1DA] shadow-md flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#1B1416] border border-[#E8E1DA] shadow-md flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Photo Indicator Badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15171A]/85 backdrop-blur-xs text-white text-xs font-poppins font-medium shadow-md">
                <span>
                  Photo {currentIndex + 1} of {imagesList.length}
                </span>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-1.5">
                  {imagesList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to photo ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/70 w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
