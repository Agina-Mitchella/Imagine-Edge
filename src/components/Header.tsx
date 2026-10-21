import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, FileDown, Phone, Mail, Instagram, Loader2, Upload } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { smoothScrollTo } from '../utils/scrollHelper';
import { Magnetic } from './Magnetic';
import { downloadCompanyProfilePdf } from '../utils/pdfDownload';
import { Logo } from './Logo';

gsap.registerPlugin(ScrollTrigger);

interface HeaderProps {
  onOpenQuote: (preselectedCategory?: string) => void;
  onOpenProfile: () => void;
  onOpenLogoUpload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuote, onOpenProfile, onOpenLogoUpload }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  const handleDownloadProfile = async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadProgress(0);
    try {
      await downloadCompanyProfilePdf((percent) => {
        setDownloadProgress(percent);
      });
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    let lastScroll = 0;

    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        const currentScroll = self.scroll();

        if (currentScroll > 80) {
          setIsCompact(true);
        } else {
          setIsCompact(false);
        }

        if (currentScroll > 100) {
          if (self.direction === 1 && currentScroll - lastScroll > 5) {
            gsap.to(headerEl, {
              yPercent: -130,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          } else if (self.direction === -1) {
            gsap.to(headerEl, {
              yPercent: 0,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        } else {
          gsap.to(headerEl, {
            yPercent: 0,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }

        lastScroll = currentScroll;
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'What we make', href: '#what-we-make' },
    { label: 'Printing', href: '#printing-methods' },
    { label: 'Work', href: '#selected-work' },
    { label: 'About', href: '#about' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    smoothScrollTo(href, -80);
  };

  return (
    <>
      {/* Floating White Card Header */}
      <header
        ref={headerRef}
        className={`fixed top-3 sm:top-4 inset-x-3 sm:inset-x-6 lg:inset-x-8 max-w-7xl mx-auto z-40 transition-[padding,transform,box-shadow,background-color] duration-300 will-change-transform ${
          isCompact
            ? 'bg-white/95 backdrop-blur-md shadow-2xl py-2 sm:py-2.5 px-4 sm:px-5 border border-slate-200/90'
            : 'bg-white shadow-xl py-3.5 sm:py-4 px-4 sm:px-6 border border-slate-100'
        } rounded-2xl flex items-center justify-between`}
      >
        {/* Left: Brand Wordmark / Custom Uploaded Logo */}
        <a
          href="#top"
          onClick={(e) => handleLinkClick(e, '#top')}
          className="group flex flex-col justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red rounded-lg p-0.5"
          aria-label="Imaginedge Solutions Homepage"
        >
          <Logo variant="dark" isCompact={isCompact} />
        </a>

        {/* Centre: Desktop Navigation Links (Ink Text, Red Hover Underline) */}
        <nav
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs xl:text-sm font-semibold text-ink"
          aria-label="Primary Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="relative py-1 text-ink hover:text-red transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red rounded group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Upload Logo Trigger Button */}
          {onOpenLogoUpload && (
            <Magnetic strength={0.2}>
              <button
                type="button"
                onClick={onOpenLogoUpload}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red whitespace-nowrap cursor-pointer rounded-full hover:bg-slate-100 border border-slate-200/80 shadow-xs"
                title="Upload or change company logo"
                aria-label="Upload brand logo"
              >
                <Upload className="w-3.5 h-3.5 text-red" />
                <span>Logo</span>
              </button>
            </Magnetic>
          )}

          {/* Profile Document Reader Button (Desktop) */}
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={onOpenProfile}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red whitespace-nowrap cursor-pointer rounded-full hover:bg-slate-50"
              aria-label="Open Imaginedge Company Profile Document"
            >
              <span>Profile</span>
            </button>
          </Magnetic>

          {/* Download Profile Button (Desktop) */}
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={handleDownloadProfile}
              disabled={downloading}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:text-red bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-full transition-all border border-slate-200/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red whitespace-nowrap cursor-pointer shadow-sm disabled:opacity-75"
              aria-label="Download Imaginedge Company Profile PDF"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 text-red animate-spin" />
                  <span>{downloadProgress > 0 ? `Saving ${downloadProgress}%` : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-red" />
                  <span>Download Profile</span>
                </>
              )}
            </button>
          </Magnetic>

          {/* Solid Red "Contact us" button with Magnetic */}
          <Magnetic strength={0.3}>
            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-red hover:bg-red-hover active:scale-95 rounded-full transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red whitespace-nowrap cursor-pointer"
            >
              Contact us
            </button>
          </Magnetic>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-ink hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Crimson Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-crimson bg-crimson-pattern text-white flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-200 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <Logo variant="light" isCompact={false} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close navigation overlay"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-5 my-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-2xl sm:text-3xl font-extrabold text-white/95 hover:text-white hover:translate-x-1 transition-all flex items-center justify-between py-1 group"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/15 space-y-5">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-3 px-5 rounded-full bg-red text-white font-bold text-sm text-center shadow-lg hover:bg-red-hover transition-colors border border-white/20 cursor-pointer"
              >
                Contact us / Get Quote
              </button>
              {onOpenLogoUpload && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogoUpload();
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Brand Logo</span>
                </button>
              )}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full py-2.5 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDownloadProfile();
                  }}
                  disabled={downloading}
                  className="w-full py-2.5 px-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs text-center shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-red animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5 text-red" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Contacts in Overlay (White icons/text on crimson background, no red text) */}
            <div className="pt-2 text-xs text-white/90 space-y-2">
              <a
                href="https://wa.me/254710428485"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>0710 428 485 / +254 710 428 485</span>
              </a>
              <a
                href="mailto:jmutitu@imaginedgesolutions.co.ke"
                className="flex items-center gap-2.5 hover:text-white"
              >
                <Mail className="w-4 h-4 text-white" />
                <span>jmutitu@imaginedgesolutions.co.ke</span>
              </a>
              <a
                href="https://instagram.com/imaginedgesolutions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white"
              >
                <Instagram className="w-4 h-4 text-white" />
                <span>@imaginedgesolutions</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
