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

  // Keep first three paragraphs; fourth paragraph deleted as requested
  const paragraphsText = [
    'Imaginedge Solutions is run by experienced professionals in graphic design, branding and printing. Our creative designers make it possible to impress our clients.',
    'Our digital printing machines run for long hours at the highest resolution. We go beyond expectations, deliver on last-minute timelines and keep strict quality control.',
    'We are built on efficiency, attention to detail, honesty, objectivity, commitment and accountability. These have earned us the respect of organisations and institutions.',
  ];

  const headingFullText = 'A Kenyan-owned print and branding company in Nairobi.';

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const headingEl = headingRef.current;
    const paragraphsEl = paragraphsRef.current;
    if (!sectionEl || !headingEl || !paragraphsEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper: Build line-by-line reveal structure from naturally wrapped lines
    const setupHeadingLines = () => {
      if (prefersReducedMotion) return;

      // Split into temporary spans to measure natural line breaks
      const words = headingFullText.split(' ');
      headingEl.innerHTML = words
        .map((w) => `<span class="temp-measure-word inline-block mr-[0.25em]">${w}</span>`)
        .join('');

      const wordNodes = Array.from(
        headingEl.querySelectorAll<HTMLElement>('.temp-measure-word')
      );
      if (wordNodes.length === 0) return;

      const linesMap = new Map<number, string[]>();
      wordNodes.forEach((node) => {
        const top = Math.round(node.offsetTop);
        // Group words on the same line (within 6px tolerance)
        let matchedKey = Array.from(linesMap.keys()).find((k) => Math.abs(k - top) < 6);
        if (matchedKey === undefined) {
          matchedKey = top;
          linesMap.set(matchedKey, []);
        }
        linesMap.get(matchedKey)!.push(node.textContent || '');
      });

      // Construct wrapped masked lines
      headingEl.innerHTML = Array.from(linesMap.values())
        .map(
          (lineWords) =>
            `<span class="block overflow-hidden py-0.5"><span class="about-heading-line block">${lineWords.join(
              ' '
            )}</span></span>`
        )
        .join('');
    };

    setupHeadingLines();

    if (prefersReducedMotion) {
      // Ensure words and heading are immediately visible
      const words = paragraphsEl.querySelectorAll<HTMLElement>('.scrub-word');
      words.forEach((w) => {
        w.style.opacity = '1';
      });
      return;
    }

    const mm = gsap.matchMedia();

    // DESKTOP: Heading line reveal & scroll-scrubbed word highlight
    mm.add(MOTION_CONFIG.breakpoints.desktop, () => {
      const headingLines = headingEl.querySelectorAll('.about-heading-line');
      if (headingLines.length > 0) {
        gsap.fromTo(
          headingLines,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: MOTION_CONFIG.easing.reveal,
            scrollTrigger: {
              trigger: headingEl,
              start: 'top 85%',
            },
          }
        );
      }

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

      // Words unread at 55% opacity, brightening to 100% on scroll
      const words = paragraphsEl.querySelectorAll('.scrub-word');
      gsap.fromTo(
        words,
        { opacity: 0.55 },
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

    // MOBILE: Heading line reveal & scroll-scrubbed word highlight
    mm.add(MOTION_CONFIG.breakpoints.mobile, () => {
      const headingLines = headingEl.querySelectorAll('.about-heading-line');
      if (headingLines.length > 0) {
        gsap.fromTo(
          headingLines,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.09,
            duration: 0.65,
            ease: MOTION_CONFIG.easing.reveal,
            scrollTrigger: {
              trigger: headingEl,
              start: 'top 88%',
            },
          }
        );
      }

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
        { opacity: 0.55 },
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

    // Re-evaluate line wrapping on resize
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setupHeadingLines();
        const headingLines = headingEl.querySelectorAll('.about-heading-line');
        if (headingLines.length > 0) {
          gsap.set(headingLines, { yPercent: 0, opacity: 1 });
        }
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-header-theme="crimson"
      className="relative w-full bg-crimson bg-crimson-pattern text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 select-none"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Eyebrow, Naturally Wrapping Heading & Core Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider">
              <span>About Us</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Nairobi, Kenya</span>
            </div>

            {/* Naturally wrapping heading with text-wrap: balance, clamp(2rem, 4.2vw, 3.75rem), line-height 1.1 */}
            <h2
              ref={headingRef}
              style={{ textWrap: 'balance' }}
              className="font-bold text-white tracking-tight text-[clamp(2rem,4.2vw,3.75rem)] leading-[1.1]"
            >
              {headingFullText}
            </h2>

            {/* Core Values Tag Strip */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-white/90">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                Efficiency & Detail
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                Strict Quality Control
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                Last-Minute Delivery
              </span>
            </div>
          </div>

          {/* Right Column: 3 Paragraphs with Scroll Highlight & Button below 3rd paragraph */}
          <div
            ref={paragraphsRef}
            className="lg:col-span-6 space-y-6 text-white font-normal text-base sm:text-lg leading-relaxed lg:pl-6"
          >
            {paragraphsText.map((p, pIdx) => {
              const words = p.split(' ');
              return (
                <p key={pIdx} className="text-white leading-relaxed">
                  {words.map((word, wIdx) => (
                    <span
                      key={wIdx}
                      className="scrub-word inline-block mr-1.5 will-change-opacity"
                      style={{ opacity: 0.55 }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              );
            })}

            {/* White CTA Button below third paragraph */}
            <div className="pt-3">
              <Magnetic strength={0.3}>
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-crimson font-bold text-sm sm:text-base hover:bg-slate-100 transition-all shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  <span>Start your project with us</span>
                  <ArrowRight className="w-4 h-4 text-crimson" />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
