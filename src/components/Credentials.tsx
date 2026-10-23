import React, { useRef, useEffect, useState } from 'react';
import { Building2, Receipt, Award, MapPin, ShieldCheck, FileCheck, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CREDENTIALS_LIST } from '../data/siteContent';
import { MOTION_CONFIG } from '../config/motionConfig';
import { Magnetic } from './Magnetic';
import { downloadCompanyProfilePdf } from '../utils/pdfDownload';

gsap.registerPlugin(ScrollTrigger);

interface CredentialsProps {
  onOpenProfile: () => void;
}

export const Credentials: React.FC<CredentialsProps> = ({ onOpenProfile }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const badgesGridRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadProgress(0);
    try {
      await downloadCompanyProfilePdf((percent) => setDownloadProgress(percent));
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const gridEl = badgesGridRef.current;
    if (!sectionEl || !gridEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = gridEl.querySelectorAll('.credential-badge-card');

    // Prepare self-drawing checkmarks
    cards.forEach((card) => {
      const checkPath = card.querySelector<SVGPathElement>('.badge-checkmark-path');
      if (checkPath) {
        const len = checkPath.getTotalLength ? checkPath.getTotalLength() : 40;
        checkPath.style.strokeDasharray = `${len}`;
        checkPath.style.strokeDashoffset = `${len}`;
      }
    });

    const mm = gsap.matchMedia();

    // DESKTOP: Badges slide up + self-drawing checkmarks
    mm.add(MOTION_CONFIG.breakpoints.desktop, () => {
      gsap.fromTo(
        cards,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: MOTION_CONFIG.stagger.badges,
          duration: 0.65,
          ease: MOTION_CONFIG.easing.reveal,
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              cards.forEach((card, idx) => {
                const checkPath = card.querySelector<SVGPathElement>('.badge-checkmark-path');
                if (checkPath) {
                  gsap.to(checkPath, {
                    strokeDashoffset: 0,
                    duration: 0.5,
                    delay: idx * MOTION_CONFIG.stagger.badges + 0.35,
                    ease: 'power2.out',
                  });
                }
              });
            },
          },
        }
      );
    });

    // MOBILE: Badges slide up + self-drawing checkmarks
    mm.add(MOTION_CONFIG.breakpoints.mobile, () => {
      cards.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            delay: idx * 0.08,
            duration: 0.55,
            ease: MOTION_CONFIG.easing.reveal,
            scrollTrigger: {
              trigger: gridEl,
              start: 'top 88%',
              once: true,
              onEnter: () => {
                const checkPath = card.querySelector<SVGPathElement>('.badge-checkmark-path');
                if (checkPath) {
                  gsap.to(checkPath, {
                    strokeDashoffset: 0,
                    duration: 0.45,
                    delay: idx * 0.08 + 0.25,
                    ease: 'power2.out',
                  });
                }
              },
            },
          }
        );
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  const getBadgeIcon = (index: number) => {
    const iconClass = 'w-5 h-5 text-white/90 shrink-0';
    switch (index) {
      case 0:
        return <Building2 className={iconClass} />;
      case 1:
        return <Receipt className={iconClass} />;
      case 2:
        return <Award className={iconClass} />;
      case 3:
        return <MapPin className={iconClass} />;
      default:
        return <ShieldCheck className={iconClass} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="credentials"
      data-header-theme="crimson"
      className="relative w-full bg-crimson bg-crimson-pattern text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Four Badges Grid with Stagger & Self-Drawing Checkmarks */}
          <div
            ref={badgesGridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 flex-1"
          >
            {CREDENTIALS_LIST.map((item, idx) => (
              <div
                key={idx}
                className="credential-badge-card relative flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all will-change-transform"
              >
                <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center shrink-0 shadow-inner">
                  {getBadgeIcon(idx)}
                </div>
                <div className="flex-1 pr-6">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-0.5 leading-relaxed font-light">
                    {item.subtitle}
                  </p>
                </div>

                {/* Self-drawing checkmark indicator on corner */}
                <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      className="badge-checkmark-path"
                      d="M2.5 6.5 L4.8 8.8 L9.5 3.5"
                      stroke="#4ade80"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small Line & Compliance CTA */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/80">
          <p className="flex items-center gap-2 text-center sm:text-left font-light">
            <ShieldCheck className="w-4 h-4 text-white/90 shrink-0 inline" />
            <span>Compliance documents available on request for procurement teams.</span>
          </p>
          <div className="flex items-center gap-2.5">
            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={onOpenProfile}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all cursor-pointer text-xs"
              >
                <span>View Profile Deck</span>
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-bold transition-all shadow-md cursor-pointer text-xs disabled:opacity-75"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-red animate-spin" />
                    <span>Saving {downloadProgress > 0 ? `${downloadProgress}%` : '...'}</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-3.5 h-3.5 text-red" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
};
