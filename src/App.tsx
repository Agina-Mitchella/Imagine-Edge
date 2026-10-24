import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhatWeMake } from './components/WhatWeMake';
import { About } from './components/About';
import { PrintingMethods } from './components/PrintingMethods';
import { SelectedWorkCarousel } from './components/SelectedWorkCarousel';
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
        lerp: 0.12,
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.6,
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
    smoothScrollTo('#selected-work', -80);
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

      {/* 1. HEADER: floating compact bar with dynamic section-based theme switching */}
      <Header
        onOpenQuote={() => handleOpenQuote()}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLogoUpload={() => setIsLogoUploadOpen(true)}
      />

      {/* Main Content Sections (Strict Page Structure Order - Clean Hard Edges) */}
      <main className="flex-1 w-full flex flex-col">
        {/* 2. HERO: dark slider with clear full-bleed photo & left frosted glass card */}
        <Hero
          onOpenQuote={() => handleOpenQuote()}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* 3. WHAT WE MAKE: crimson icon grid */}
        <WhatWeMake onSelectCategory={handleSelectWhatWeMakeCategory} />

        {/* 4. ABOUT: crimson two columns */}
        <About onOpenQuote={() => handleOpenQuote()} />

        {/* 5. FIVE WAYS TO PRINT: dark methods */}
        <PrintingMethods onOpenQuote={handleOpenQuote} />

        {/* 6. SELECTED WORK: light fit-text heading & carousel */}
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
