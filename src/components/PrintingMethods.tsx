import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Zap,
  Layers,
  Flag,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { PRINTING_METHODS } from '../data/siteContent';

gsap.registerPlugin(ScrollTrigger);

interface PrintingMethodsProps {
  onOpenQuote: (service?: string) => void;
}

export const PrintingMethods: React.FC<PrintingMethodsProps> = ({ onOpenQuote }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const gridEl = gridRef.current;
    if (!sectionEl || !gridEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = gridEl.querySelectorAll('.print-service-card');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 88%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getMethodIcon = (id: string, isWhiteText: boolean) => {
    const iconClass = `w-4 h-4 sm:w-5 sm:h-5 ${isWhiteText ? 'text-white' : 'text-[#15171A]'}`;
    switch (id) {
      case 'digital':
        return <Zap className={iconClass} />;
      case 'offset':
        return <Layers className={iconClass} />;
      case 'flex':
        return <Flag className={iconClass} />;
      case 'screen':
        return <Shirt className={iconClass} />;
      case 'sublimation':
        return <Sparkles className={iconClass} />;
      default:
        return <Zap className={iconClass} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="printing-methods"
      data-header-theme="dark"
      className="relative w-full bg-[#FAF9F6] text-charcoal py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-t border-b border-[#E8E1DA]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-0.5 rounded-full bg-white border border-[#E8E1DA] text-[11px] font-semibold tracking-wider text-red uppercase">
            <span>Printing Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
            Five ways to print. One team to choose the right one.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-charcoal/70 leading-relaxed max-w-2xl">
            From rapid digital runs to heavy industrial offset, weather-resistant flex, screen printing and sublimation, we match your job to the right press for zero compromise on quality and cost.
          </p>
        </div>

        {/* Five Colored Cards Grid (Teal, Red, Yellow, Orange, Blue) */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          {PRINTING_METHODS.map((method, index) => {
            // White text only on blue sublimation card, charcoal #15171A text on all other cards
            const isWhiteText = method.id === 'sublimation';
            const textColor = isWhiteText ? 'text-white' : 'text-[#15171A]';
            const subTextColor = isWhiteText ? 'text-white/90' : 'text-[#15171A]/85';
            const badgeBg = isWhiteText ? 'bg-white/20 text-white' : 'bg-black/10 text-[#15171A]';
            const counterColor = isWhiteText ? 'text-white/55' : 'text-[#15171A]/45';
            const iconBg = isWhiteText ? 'bg-white/20' : 'bg-black/10';

            // Top row: 3 cards (span 2 each), Bottom row: 2 cards (span 3 each)
            const colSpanClass = index < 3 ? 'lg:col-span-2' : 'lg:col-span-3';
            const mdColSpanClass = index === 4 ? 'md:col-span-2' : 'md:col-span-1';

            return (
              <div
                key={method.id}
                style={{ backgroundColor: method.accentHex }}
                className={`print-service-card ${colSpanClass} ${mdColSpanClass} group rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar: Icon + Badge + Number counter */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${iconBg} backdrop-blur-sm flex items-center justify-center shrink-0`}>
                        {getMethodIcon(method.id, isWhiteText)}
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                        {method.badge}
                      </span>
                    </div>

                    <span className={`font-poppins text-xs sm:text-sm font-bold ${counterColor}`}>
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-lg sm:text-xl lg:text-2xl font-extrabold ${textColor} tracking-tight`}>
                    {method.name}
                  </h3>
                  <p className={`mt-1.5 text-xs sm:text-sm ${subTextColor} leading-relaxed`}>
                    {method.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centred CTA below the cards */}
        <div className="mt-12 sm:mt-16 text-center max-w-xl mx-auto flex flex-col items-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#15171A] tracking-tight">
            Not sure which method suits your job?
          </h3>
          <p className="mt-2 text-sm sm:text-base text-[#15171A]/75 font-normal">
            Tell us what you need and we'll recommend one.
          </p>
          <button
            type="button"
            onClick={() => onOpenQuote()}
            className="mt-6 px-8 py-3.5 rounded-full bg-[#B52026] hover:bg-[#921B1D] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026]"
          >
            Get a quote
          </button>
        </div>
      </div>
    </section>
  );
};
