import React, { useRef, useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_CONFIG } from '../config/motionConfig';
import { Magnetic } from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  onOpenQuote: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenQuote }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);

  const paragraphsText = [
    'Imaginedge Solutions is run by experienced professionals in graphic design, branding and printing. Our creative designers make it possible to impress our clients.',
    'Our digital printing machines run for long hours at the highest resolution. We go beyond expectations, deliver on last-minute timelines and keep strict quality control.',
    'We are built on efficiency, attention to detail, honesty, objectivity, commitment and accountability. These have earned us the respect of organisations and institutions.',
    "Send us a brief and we'll handle the design, the print and the delivery.",
  ];

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const headingEl = headingRef.current;
    const paragraphsEl = paragraphsRef.current;
    if (!sectionEl || !headingEl || !paragraphsEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // DESKTOP: Heading reveal & scrubbed word highlight
    mm.add(MOTION_CONFIG.breakpoints.desktop, () => {
      const headingLines = headingEl.querySelectorAll('.about-heading-line');
      gsap.fromTo(
        headingLines,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          duration: MOTION_CONFIG.durations.reveal,
          ease: MOTION_CONFIG.easing.reveal,
          scrollTrigger: {
            trigger: headingEl,
            start: 'top 85%',
          },
        }
      );

      gsap.to(sectionEl, {
        backgroundPositionY: '120px',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      const words = paragraphsEl.querySelectorAll('.scrub-word');
      gsap.fromTo(
        words,
        { opacity: 0.25 },
        {
          opacity: 1,
          stagger: 0.02,
          ease: 'none',
          scrollTrigger: {
            trigger: paragraphsEl,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.5,
          },
        }
      );
    });

    // MOBILE: Line-by-line heading reveal & scroll-scrubbed word highlight
    mm.add(MOTION_CONFIG.breakpoints.mobile, () => {
      const headingLines = headingEl.querySelectorAll('.about-heading-line');
      gsap.fromTo(
        headingLines,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: MOTION_CONFIG.easing.reveal,
          scrollTrigger: {
            trigger: headingEl,
            start: 'top 88%',
          },
        }
      );

      gsap.to(sectionEl, {
        backgroundPositionY: '50px',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      const words = paragraphsEl.querySelectorAll('.scrub-word');
      gsap.fromTo(
        words,
        { opacity: 0.25 },
        {
          opacity: 1,
          stagger: 0.015,
          ease: 'none',
          scrollTrigger: {
            trigger: paragraphsEl,
            start: 'top 82%',
            end: 'bottom 55%',
            scrub: 0.4,
          },
        }
      );
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-crimson bg-crimson-pattern text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading Line by Line Reveal from Behind Mask */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider">
              <span>About Us</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Nairobi, Kenya</span>
            </div>

            <h2
              ref={headingRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-bold text-white tracking-tight leading-[1.2]"
            >
              <span className="block overflow-hidden py-0.5">
                <span className="about-heading-line block">Hello. We're Imaginedge</span>
              </span>
              <span className="block overflow-hidden py-0.5">
                <span className="about-heading-line block">Solutions, a Kenyan-owned</span>
              </span>
              <span className="block overflow-hidden py-0.5">
                <span className="about-heading-line block">print and branding company in</span>
              </span>
              <span className="block overflow-hidden py-0.5">
                <span className="about-heading-line block">Nairobi. Come and see what</span>
              </span>
              <span className="block overflow-hidden py-0.5">
                <span className="about-heading-line block">we make.</span>
              </span>
            </h2>

            {/* Core Values Tag Strip */}
            <div className="pt-4 flex flex-wrap gap-2 text-xs font-medium text-white/80">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-white/90" />
                Efficiency & Detail
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-white/90" />
                Strict Quality Control
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-white/90" />
                Last-Minute Delivery
              </span>
            </div>
          </div>

          {/* Right Column: 4 Paragraphs with Scroll-Scrubbed Text Highlighting */}
          <div
            ref={paragraphsRef}
            className="lg:col-span-6 space-y-6 text-white font-light text-base sm:text-lg leading-relaxed lg:pl-6"
          >
            {paragraphsText.map((p, pIdx) => {
              const isLast = pIdx === paragraphsText.length - 1;
              const words = p.split(' ');
              return (
                <div
                  key={pIdx}
                  className={`border-l-2 pl-4 ${
                    isLast ? 'border-white pt-2' : 'border-white/20'
                  }`}
                >
                  <p className={isLast ? 'text-white font-medium text-lg sm:text-xl' : ''}>
                    {words.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="scrub-word inline-block mr-1.5 will-change-opacity"
                        style={{ opacity: 0.25 }}
                      >
                        {word}
                      </span>
                    ))}
                  </p>

                  {isLast && (
                    <div className="mt-6">
                      <Magnetic strength={0.3}>
                        <button
                          type="button"
                          onClick={onOpenQuote}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-crimson font-bold text-sm hover:bg-slate-100 transition-all shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          <span>Start your project with us</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Magnetic>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
