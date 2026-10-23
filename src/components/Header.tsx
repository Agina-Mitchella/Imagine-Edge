import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, FileDown, Phone, Mail, Instagram, Loader2 } from 'lucide-react';
import { smoothScrollTo } from '../utils/scrollHelper';
import { Magnetic } from './Magnetic';
import { downloadCompanyProfilePdf } from '../utils/pdfDownload';
import { Logo } from './Logo';

export type HeaderTheme = 'dark' | 'light' | 'crimson';

interface HeaderProps {
  onOpenQuote: (preselectedCategory?: string) => void;
  onOpenProfile: () => void;
  onOpenLogoUpload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuote }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<HeaderTheme>('dark');
  const [isVisible, setIsVisible] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const lastScrollYRef = useRef(0);
  const prefersReducedMotionRef = useRef(false);

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

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Body lock on mobile menu open
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

  // Hide on scroll down, show on scroll up, always visible when menu is open or at top
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const delta = currentScrollY - lastScrollY;

      // Always show at top of page
      if (currentScrollY <= 24) {
        setIsVisible(true);
      } else if (delta > 8 && currentScrollY > 64) {
        // Scrolled down by more than 8px past header
        setIsVisible(false);
      } else if (delta < -8) {
        // Scrolled up by more than 8px
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // IntersectionObserver + viewport detection to switch header themes based on section behind header
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme]'));
    if (sections.length === 0) return;

    const checkHeaderTheme = () => {
      // Header center is approximately 40-44px from top of viewport
      const headerPointY = 44;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerPointY && rect.bottom > headerPointY) {
          const t = section.getAttribute('data-header-theme') as HeaderTheme;
          if (t && (t === 'dark' || t === 'light' || t === 'crimson')) {
            setTheme(t);
          }
          break;
        }
      }
    };

    // Initial check
    checkHeaderTheme();

    const observer = new IntersectionObserver(
      () => {
        checkHeaderTheme();
      },
      {
        rootMargin: '-12px 0px -85% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    window.addEventListener('scroll', checkHeaderTheme, { passive: true });
    window.addEventListener('resize', checkHeaderTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkHeaderTheme);
      window.removeEventListener('resize', checkHeaderTheme);
    };
  }, []);

  const navLinks = [
    { label: 'What we make', href: '#what-we-make' },
    { label: 'Printing', href: '#printing-methods' },
    { label: 'Work', href: '#selected-work' },
    { label: 'Clients', href: '#clients' },
    { label: 'About', href: '#about' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    smoothScrollTo(href, -80);
  };

  // Visual Theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          container: 'bg-[#15171A]/55 backdrop-blur-[14px] border border-white/[0.14] text-white',
          navText: 'text-white/85 hover:text-white',
          navUnderline: 'bg-[#B52026]',
          downloadBtn: 'border border-white/70 text-white hover:bg-white/10 active:bg-white/15',
          contactBtn: 'bg-[#B52026] text-white hover:bg-[#921B1D]',
          hamburger: 'text-white hover:bg-white/10',
          logoVariant: 'dark' as const,
        };
      case 'light':
        return {
          container: 'bg-white/90 backdrop-blur-[14px] border border-[#E8E1DA] text-[#1B1416]',
          navText: 'text-[#1B1416]/85 hover:text-[#B52026]',
          navUnderline: 'bg-[#B52026]',
          downloadBtn: 'border border-[#1B1416]/70 text-[#1B1416] hover:bg-[#1B1416]/5 active:bg-[#1B1416]/10',
          contactBtn: 'bg-[#B52026] text-white hover:bg-[#921B1D]',
          hamburger: 'text-[#1B1416] hover:bg-black/5',
          logoVariant: 'light' as const,
        };
      case 'crimson':
        return {
          container: 'bg-[#7A1519]/80 backdrop-blur-[14px] border border-white/[0.18] text-white',
          navText: 'text-white/90 hover:text-white',
          navUnderline: 'bg-white',
          downloadBtn: 'border border-white/80 text-white hover:bg-white/10 active:bg-white/15',
          contactBtn: 'bg-white text-[#921B1D] hover:bg-white/95 font-bold shadow-xs',
          hamburger: 'text-white hover:bg-white/10',
          logoVariant: 'crimson' as const,
        };
    }
  };

  const currentStyles = getThemeStyles();

  return (
    <>
      {/* Compact Floating Bar Header */}
      <header
        className={`fixed top-3 inset-x-3 max-w-[1280px] mx-auto z-40 rounded-2xl h-14 lg:h-16 px-4 sm:px-6 flex items-center justify-between transition-all duration-300 font-poppins select-none ${
          currentStyles.container
        } ${
          !isVisible && !mobileMenuOpen
            ? '-translate-y-[130%] pointer-events-none'
            : 'translate-y-0 pointer-events-auto'
        }`}
        style={{
          fontFamily: "'Poppins', sans-serif",
          transitionProperty: 'background-color, border-color, color, transform, opacity',
        }}
        aria-label="Site Header"
      >
        {/* Left: 20% Larger Logo (Tagline removed, white wordmark with red e for dark, crimson for light, white for crimson) */}
        <a
          href="#top"
          onClick={(e) => handleLinkClick(e, '#top')}
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026] rounded-lg transition-transform hover:opacity-95"
          aria-label="Imaginedge Solutions Home"
        >
          <Logo
            variant={currentStyles.logoVariant}
            isHeader={true}
            showTagline={false}
          />
        </a>

        {/* Centre: Desktop Nav (1024px and up): What we make, Printing, Work, Clients, About */}
        <nav
          className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-semibold"
          aria-label="Primary Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`relative py-1 transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026] rounded group ${currentStyles.navText}`}
            >
              <span>{link.label}</span>
              <span
                className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full ${currentStyles.navUnderline}`}
              />
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* "Download profile": Desktop (1024px+) outlined pill, 1px border in current text color, transparent fill, no blue-grey */}
          <div className="hidden lg:block">
            <Magnetic strength={0.2}>
              <button
                type="button"
                onClick={handleDownloadProfile}
                disabled={downloading}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs xl:text-sm font-semibold rounded-full bg-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026] whitespace-nowrap cursor-pointer active:scale-95 disabled:opacity-75 ${currentStyles.downloadBtn}`}
                aria-label="Download Imaginedge Company Profile PDF"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{downloadProgress > 0 ? `${downloadProgress}%` : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download profile</span>
                  </>
                )}
              </button>
            </Magnetic>
          </div>

          {/* "Contact us": Solid #B52026 with white text, or white with #921B1D text over crimson sections */}
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={() => onOpenQuote()}
              className={`inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026] whitespace-nowrap cursor-pointer shadow-sm ${currentStyles.contactBtn}`}
            >
              Contact us
            </button>
          </Magnetic>

          {/* Below 1024px: Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026] ${currentStyles.hamburger}`}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Crimson Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#7A1519] bg-crimson-pattern text-white flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-200 overflow-y-auto font-poppins"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Header Row inside overlay */}
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <Logo variant="crimson" isHeader={true} showTagline={false} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close navigation overlay"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav links: What we make, Printing, Work, Clients, About */}
          <nav className="flex flex-col gap-4 sm:gap-5 my-8">
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

          {/* Action Buttons: Contact Us + Download Profile (Inside mobile menu overlay) */}
          <div className="pt-6 border-t border-white/15 space-y-4">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-3 px-5 rounded-full bg-[#B52026] text-white font-bold text-sm text-center shadow-lg hover:bg-[#921B1D] transition-colors border border-white/20 cursor-pointer"
              >
                Contact us / Get quote
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadProfile();
                }}
                disabled={downloading}
                className="w-full py-3 px-4 rounded-full bg-transparent border border-white/80 text-white hover:bg-white/10 font-semibold text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{downloadProgress > 0 ? `Saving ${downloadProgress}%` : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>Download profile</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Contacts in Overlay */}
            <div className="pt-2 text-xs text-white/90 space-y-2">
              <a
                href="https://wa.me/254710428485"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>0710 428 485 / +254 710 428 485</span>
              </a>
              <a
                href="mailto:jmutitu@imaginedgesolutions.co.ke"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-white" />
                <span>jmutitu@imaginedgesolutions.co.ke</span>
              </a>
              <a
                href="https://instagram.com/imaginedgesolutions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
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
