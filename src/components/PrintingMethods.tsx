import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Zap,
  Layers,
  Flag,
  Shirt,
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

  const getMethodIcon = (id: string, isLightBg: boolean) => {
    const iconClass = `w-4 h-4 sm:w-5 sm:h-5 ${isLightBg ? 'text-charcoal' : 'text-white'}`;
    switch (id) {
      case 'digital':
        return <Zap className={iconClass} />;
      case 'offset':
        return <Layers className={iconClass} />;
      case 'flex':
        return <Flag className={iconClass} />;
      case 'screen':
        return <Shirt className={iconClass} />;
      default:
        return <Zap className={iconClass} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="printing-methods"
      className="relative w-full bg-[#FAF9F6] text-charcoal py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-t border-b border-[#E8E1DA]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-0.5 rounded-full bg-white border border-[#E8E1DA] text-[11px] font-semibold tracking-wider text-red uppercase">
            <span>Printing Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
            Four ways to print. One team to choose the right one.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-charcoal/70 leading-relaxed max-w-2xl">
            From rapid digital runs to heavy industrial offset and weather-resistant flex, we match your job to the right press for zero compromise on quality and cost.
          </p>
        </div>

        {/* Compact 2-Column Colored Cards Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5"
        >
          {PRINTING_METHODS.map((method, index) => {
            const isLightBg = method.id === 'flex';
            const textColor = isLightBg ? 'text-charcoal' : 'text-white';
            const subTextColor = isLightBg ? 'text-charcoal/85' : 'text-white/90';
            const badgeBg = isLightBg ? 'bg-black/10 text-charcoal' : 'bg-white/20 text-white';
            const counterColor = isLightBg ? 'text-charcoal/45' : 'text-white/55';
            const iconBg = isLightBg ? 'bg-black/10' : 'bg-white/20';
            const btnBg = isLightBg
              ? 'bg-charcoal text-white hover:bg-black'
              : 'bg-white text-charcoal hover:bg-white/95';

            return (
              <div
                key={method.id}
                style={{ backgroundColor: method.accentHex }}
                className="print-service-card group rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Badge + Number counter */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${iconBg} backdrop-blur-sm flex items-center justify-center shrink-0`}>
                        {getMethodIcon(method.id, isLightBg)}
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
                  <p className={`mt-1.5 text-xs sm:text-sm ${subTextColor} leading-relaxed max-w-xl`}>
                    {method.description}
                  </p>
                </div>

                {/* Bottom Action: Simple Contact Link / Button */}
                <div className="pt-4 mt-4 border-t border-black/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenQuote(method.name)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${btnBg} shadow-sm transition-all duration-150 group/btn cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
                  >
                    <span>Contact us for this</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
