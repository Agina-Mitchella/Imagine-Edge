import React, { useRef, useEffect, useState } from 'react';
import { ArrowUpRight, Phone, Mail, Instagram, MapPin, FileDown, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from './Magnetic';
import { downloadCompanyProfilePdf } from '../utils/pdfDownload';
import { Logo } from './Logo';
import { MOTION_CONFIG } from '../config/motionConfig';

gsap.registerPlugin(ScrollTrigger);

interface ClosingFooterProps {
  onOpenQuote: () => void;
  onOpenProfile?: () => void;
  onOpenLogoUpload?: () => void;
}

export const ClosingFooter: React.FC<ClosingFooterProps> = ({ onOpenQuote, onOpenProfile, onOpenLogoUpload }) => {
  const [downloading, setDownloading] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const bgPhotoRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const quoteBtnRef = useRef<HTMLButtonElement>(null);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadCompanyProfilePdf();
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  const headingWords = 'Your partner for branded work that lands.'.split(' ');

  useEffect(() => {
    const footerEl = footerRef.current;
    const bgPhoto = bgPhotoRef.current;
    const heading = headingRef.current;
    const quoteBtn = quoteBtnRef.current;
    if (!footerEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // DESKTOP: 15% photo parallax and word reveal
    mm.add(MOTION_CONFIG.breakpoints.desktop, () => {
      if (bgPhoto) {
        gsap.fromTo(
          bgPhoto,
          { yPercent: -10 },
          {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: footerEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      if (heading) {
        const words = heading.querySelectorAll('.cta-word');
        gsap.fromTo(
          words,
          { opacity: 0.25, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: {
              trigger: footerEl,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 0.5,
            },
          }
        );
      }
    });

    // MOBILE: about 8% photo parallax and word-by-word reveal
    mm.add(MOTION_CONFIG.breakpoints.mobile, () => {
      if (bgPhoto) {
        gsap.fromTo(
          bgPhoto,
          { yPercent: -4 },
          {
            yPercent: 4, // about 8% total shift
            ease: 'none',
            scrollTrigger: {
              trigger: footerEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      if (heading) {
        const words = heading.querySelectorAll('.cta-word');
        gsap.fromTo(
          words,
          { opacity: 0.25, y: 8 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.03,
            ease: 'none',
            scrollTrigger: {
              trigger: footerEl,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 0.4,
            },
          }
        );
      }
    });

    // Button subtle pulse on view
    if (quoteBtn) {
      ScrollTrigger.create({
        trigger: footerEl,
        start: 'top 65%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            quoteBtn,
            { scale: 1 },
            {
              scale: 1.06,
              duration: 0.45,
              yoyo: true,
              repeat: 1,
              ease: 'power2.inOut',
            }
          );
        },
      });
    }

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      data-header-theme="dark"
      className="relative w-full text-white bg-footer overflow-hidden"
    >
      {/* Full-bleed photo behind near-black overlay with ~85% opacity and 15% parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={bgPhotoRef}
          src="/src/assets/images/print_floor_workshop_1792308346126.jpg"
          alt="Imaginedge Solutions Print Workshop"
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-[125%] object-cover object-center filter brightness-[0.25] contrast-[1.15] will-change-transform"
        />
        <div className="absolute inset-0 bg-footer/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12">
        {/* Top Row: Heading + Subtext + Red Pill Button */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-14 sm:pb-16 border-b border-white/15">
          <div className="max-w-2xl space-y-4">
            <h2
              ref={headingRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] will-change-transform"
            >
              {headingWords.map((word, wIdx) => (
                <span
                  key={wIdx}
                  className="cta-word inline-block mr-2.5 will-change-[opacity,transform]"
                >
                  {word}
                </span>
              ))}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Send quantities, deadlines and artwork if you have it. We'll reply with a design
              direction and a quote.
            </p>
          </div>

          {/* Red Pill Button with Soft Pulse on in-view & Magnetic */}
          <div className="shrink-0">
            <Magnetic strength={0.35}>
              <button
                ref={quoteBtnRef}
                type="button"
                onClick={onOpenQuote}
                className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-red text-white font-extrabold text-base sm:text-lg hover:bg-red-hover transition-all duration-200 shadow-2xl active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red/40"
              >
                <span>Contact us</span>
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Below it: Two Columns (Contact Us & Connect) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 py-12 sm:py-16 border-b border-white/15">
          {/* Left Column: Contact Us */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
              Contact Us
            </span>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Phone & WhatsApp</p>
                <a
                  href="https://wa.me/254710428485"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white hover:text-red underline underline-offset-8 transition-colors block"
                >
                  0710 428 485
                </a>
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-400 mb-1">Direct Procurement Email</p>
                <a
                  href="mailto:jmutitu@imaginedgesolutions.co.ke"
                  className="text-lg sm:text-xl md:text-2xl font-bold text-white hover:text-red underline underline-offset-8 transition-colors break-all block"
                >
                  jmutitu@imaginedgesolutions.co.ke
                </a>
              </div>

              <div className="pt-2 flex items-start gap-2.5 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-red shrink-0 mt-0.5" />
                <span>Vision Plaza, Aghakhan Walk, Nairobi CBD, Kenya</span>
              </div>
            </div>
          </div>

          {/* Right Column: Connect */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
              Connect
            </span>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Instagram Showcase</p>
                <a
                  href="https://instagram.com/imaginedgesolutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white hover:text-red underline underline-offset-8 transition-colors flex items-center gap-3"
                >
                  <span>@imaginedgesolutions</span>
                  <Instagram className="w-6 h-6 text-slate-400" />
                </a>
              </div>

              <div className="pt-2 text-xs text-slate-400 font-light">
                <span>Working hours: Mon - Fri 8:00 AM – 5:30 PM | Sat 8:30 AM – 1:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Identity Row */}
        <div className="pt-10 pb-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10">
          <Logo variant="light" isCompact={false} showTagline={true} isHeader={false} />
        </div>

        {/* Bottom Line: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-light">
          <p>© 2026 Imaginedge Solution Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="hover:text-white transition-colors cursor-pointer text-slate-300"
              >
                Company Profile
              </button>
            )}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="hover:text-white transition-colors flex items-center gap-1.5 font-medium text-slate-300 cursor-pointer disabled:opacity-75"
              aria-label="Download Imaginedge Company Profile PDF"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-red animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-red" />
                  <span>Download Profile</span>
                </>
              )}
            </button>
            <a href="#what-we-make" className="hover:text-white transition-colors">
              Products
            </a>
            <a href="#printing-methods" className="hover:text-white transition-colors">
              Machinery
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#top" className="hover:text-white transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
