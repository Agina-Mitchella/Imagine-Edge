import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { MOTION_CONFIG } from '../config/motionConfig';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number; // Distance multiplier (default ~0.3)
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.3,
  className = '',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Disable magnetic pull on touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: MOTION_CONFIG.durations.magnetic,
        ease: MOTION_CONFIG.easing.magnetic,
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <div ref={elementRef} className={`inline-block ${className}`}>
      {children}
    </div>
  );
};
