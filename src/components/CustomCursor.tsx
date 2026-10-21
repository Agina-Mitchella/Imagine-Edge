import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<{
    type: 'default' | 'view' | 'drag' | 'button' | 'hidden';
    label?: string;
  }>({ type: 'default' });

  useEffect(() => {
    // Hide custom cursor on touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Fast positional tracker using gsap.quickTo
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorEl) {
        const cursorVal = cursorEl.getAttribute('data-cursor');
        if (cursorVal === 'view') {
          setCursorState({ type: 'view', label: 'View' });
          return;
        } else if (cursorVal === 'drag') {
          setCursorState({ type: 'drag', label: 'Drag' });
          return;
        } else if (cursorVal === 'arrow') {
          setCursorState({ type: 'button' });
          return;
        }
      }

      // Check if button or link
      const interactiveEl = target.closest('button, a, [role="button"]') as HTMLElement | null;
      if (interactiveEl && !interactiveEl.closest('[data-no-cursor-transform]')) {
        setCursorState({ type: 'button' });
      } else {
        setCursorState({ type: 'default' });
      }
    };

    const handleMouseLeave = () => {
      setCursorState({ type: 'hidden' });
    };

    const handleMouseEnter = () => {
      setCursorState({ type: 'default' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Avoid rendering on touch or reduced motion
  if (typeof window !== 'undefined') {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return null;
  }

  const isView = cursorState.type === 'view';
  const isDrag = cursorState.type === 'drag';

  // Do not render any default red dot cursor; only show interactive badges
  if (!isView && !isDrag) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color,border-color,opacity] duration-200 ease-out select-none w-16 h-16 bg-red/95 text-white font-bold text-xs shadow-2xl backdrop-blur-sm"
      aria-hidden="true"
    >
      {isView && <span className="uppercase tracking-wider text-[11px] font-black">View</span>}
      {isDrag && <span className="uppercase tracking-wider text-[11px] font-black">Drag</span>}
    </div>
  );
};
