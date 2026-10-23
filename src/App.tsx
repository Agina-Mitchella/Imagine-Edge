import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhatWeMake } from './components/WhatWeMake';
import { About } from './components/About';
import { TabbedGallery } from './components/TabbedGallery';
import { PrintingMethods } from './components/PrintingMethods';
import { SelectedWorkCarousel } from './components/SelectedWorkCarousel';
import { Clients } from './components/Clients';
import { Credentials } from './components/Credentials';
import { ClosingFooter } from './components/ClosingFooter';
import { QuoteModal } from './components/QuoteModal';
import { LightboxModal } from './components/LightboxModal';
import { ProfileModal } from './components/ProfileModal';
import { LogoUploadModal } from './components/LogoUploadModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ProgressBar } from './components/ProgressBar';
import { CustomCursor } from './components/CustomCursor';
import { setGlobalLenis, smoothScrollTo } from './utils/scrollHelper';
import { MOTION_CONFIG } from './config/motionConfig';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteCategory, setQuoteCategory] = useState<string | undefined>(undefined);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoUploadOpen, setIsLogoUploadOpen] = useState(false);

  const [lightboxItem, setLightboxItem] = useState<{
    title: string;
    client: string;
    specs: string;
    image: string;
    materials?: string;
    category?: string;
    leadTime?: string;
  } | null>(null);

  const mainAppRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis smooth inertia scrolling and sync with GSAP ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lenis: Lenis | null = null;

    if (!prefersReducedMotion) {
      lenis = new Lenis({
        lerp: MOTION_CONFIG.lenis.lerp,
        smoothWheel: MOTION_CONFIG.lenis.smoothWheel,
        wheelMultiplier: 0.9,
      });

      setGlobalLenis(lenis);

      // Connect Lenis scroll events to ScrollTrigger updates
      lenis.on('scroll', ScrollTrigger.update);

      // Connect GSAP ticker to Lenis requestAnimationFrame
      const updateTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);

      // Recalculate ScrollTrigger on window resize & image load
      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', handleResize);

      // Listen for all image loads to ensure pins and scrub distances remain accurate
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (img.complete) {
          ScrollTrigger.refresh();
        } else {
          img.addEventListener('load', handleResize, { once: true });
        }
      });

      return () => {
        lenis?.destroy();
        setGlobalLenis(null);
        gsap.ticker.remove(updateTicker);
        window.removeEventListener('resize', handleResize);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    } else {
      // Reduced motion: ScrollTrigger default without smooth inertia
      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }
  }, []);

  const handleOpenQuote = (category?: string) => {
    setQuoteCategory(category);
    setIsQuoteOpen(true);
  };

  const handleCloseQuote = () => {
    setIsQuoteOpen(false);
  };

  const handleOpenLightbox = (item: {
    title: string;
    client: string;
    specs: string;
    image: string;
    materials?: string;
    category?: string;
    leadTime?: string;
  }) => {
    setLightboxItem(item);
  };

  const handleCloseLightbox = () => {
    setLightboxItem(null);
  };

  const handleSelectWhatWeMakeCategory = (_categoryId: string) => {
    // Category selected from WhatWeMake
  };

  return (
    <div
      ref={mainAppRef}
      className="min-h-screen bg-charcoal text-slate-100 flex flex-col relative selection:bg-red selection:text-white"
    >
      {/* Red Scroll Progress Bar */}
      <ProgressBar />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* 1. HEADER: floating white card with responsive shrink, scroll-hide and magnetic CTA */}
      <Header
        onOpenQuote={() => handleOpenQuote()}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLogoUpload={() => setIsLogoUploadOpen(true)}
      />

      {/* Main Content Sections (Strict Page Structure Order - Clean Hard Edges) */}
      <main className="flex-1 w-full flex flex-col">
        {/* 2. HERO: dark slider with word-by-word reveal, drifting 3D shapes, and desktop scrub pinning */}
        <Hero
          onOpenQuote={() => handleOpenQuote()}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* 3. WHAT WE MAKE: icon grid with 60ms stagger and self-drawing SVG icons */}
        <WhatWeMake onSelectCategory={handleSelectWhatWeMakeCategory} />

        {/* 4. ABOUT: two columns with line-by-line masked heading and scrubbed text highlighting */}
        <About onOpenQuote={() => handleOpenQuote()} />

        {/* 5. FIVE WAYS TO PRINT: desktop signature sequence with background flood wipe & animated visuals */}
        <PrintingMethods onOpenQuote={handleOpenQuote} />

        {/* 6. SELECTED WORK: dual drifting headings and desktop horizontal-scroll scrub */}
        <SelectedWorkCarousel onOpenLightbox={handleOpenLightbox} />
      </main>

      {/* 10. CLOSING CTA AND FOOTER: 15% parallax background photo and soft pulse on CTA */}
      <ClosingFooter
        onOpenQuote={() => handleOpenQuote()}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLogoUpload={() => setIsLogoUploadOpen(true)}
      />

      {/* Floating WhatsApp button on mobile (56px) */}
      <FloatingWhatsApp />

      {/* Smooth Full-Height Slide-In Quote Drawer */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={handleCloseQuote}
        preselectedCategory={quoteCategory}
      />

      {/* Lightbox Modal */}
      <LightboxModal
        item={lightboxItem}
        onClose={handleCloseLightbox}
        onRequestQuote={(itemTitle) => handleOpenQuote(itemTitle)}
      />

      {/* Profile Overview Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenQuote={() => {
          setIsProfileOpen(false);
          handleOpenQuote();
        }}
      />

      {/* Brand Logo Upload & Customizer Modal */}
      <LogoUploadModal
        isOpen={isLogoUploadOpen}
        onClose={() => setIsLogoUploadOpen(false)}
      />
    </div>
  );
}
