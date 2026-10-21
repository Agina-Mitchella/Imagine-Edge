import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  Zap,
  Layers,
  Flag,
  Shirt,
  Flame,
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

    const cards = gridEl.querySelectorAll('.print-method-card');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getMethodIcon = (id: string, isLightBg: boolean) => {
    const iconClass = `w-6 h-6 ${isLightBg ? 'text-charcoal' : 'text-white'}`;
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
        return <Flame className={iconClass} />;
      default:
        return <Zap className={iconClass} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="printing-methods"
      className="relative w-full bg-[#FAF9F6] text-charcoal py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-b border-[#E8E1DA]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white border border-[#E8E1DA] text-xs font-semibold tracking-wider text-red uppercase">
            <span>Print Technologies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
            Five ways to print. One team to choose the right one.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal/75 leading-relaxed max-w-2xl">
            From rapid digital runs to heavy industrial offset and weather-resistant flex, we match your job to the right press for zero compromise on quality and cost.
          </p>
        </div>

        {/* 2-Column Responsive Grid with Solid Colored Blocks */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch"
        >
          {PRINTING_METHODS.map((method, index) => {
            const isLightBg = method.id === 'flex';
            const textColor = isLightBg ? 'text-charcoal' : 'text-white';
            const subTextColor = isLightBg ? 'text-charcoal/80' : 'text-white/85';
            const badgeBg = isLightBg ? 'bg-black/10 text-charcoal' : 'bg-white/20 text-white';
            const counterColor = isLightBg ? 'text-charcoal/40' : 'text-white/40';
            const iconBg = isLightBg ? 'bg-black/10' : 'bg-white/20';
            const btnBg = isLightBg
              ? 'bg-charcoal text-white hover:bg-black'
              : 'bg-white text-charcoal hover:bg-white/95';

            return (
              <div
                key={method.id}
                style={{ backgroundColor: method.accentHex }}
                className={`print-method-card group rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[300px] sm:min-h-[340px] ${
                  index === 4 ? 'md:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Top Bar: Icon, Badge & Step Counter */}
                  <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${iconBg} backdrop-blur-sm flex items-center justify-center shrink-0`}>
                        {getMethodIcon(method.id, isLightBg)}
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${badgeBg}`}>
                        {method.badge}
                      </span>
                    </div>
                    <span className={`font-poppins text-sm font-bold ${counterColor}`}>
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-2xl sm:text-3xl font-extrabold ${textColor} tracking-tight mb-3`}>
                    {method.name}
                  </h3>
                  <p className={`text-sm sm:text-base ${subTextColor} leading-relaxed max-w-xl`}>
                    {method.description}
                  </p>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-8 mt-6 border-t border-black/10">
                  <button
                    type="button"
                    onClick={() => onOpenQuote(method.name)}
                    className={`inline-flex items-center justify-between gap-4 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold ${btnBg} shadow-sm transition-all duration-200 group/btn cursor-pointer`}
                  >
                    <span>Contact us for this</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
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
