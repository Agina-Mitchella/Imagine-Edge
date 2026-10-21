import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.to(bar, {
          scaleX: self.progress,
          duration: 0.05,
          ease: 'none',
          overwrite: 'auto',
        });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-red origin-left shadow-[0_1px_6px_rgba(181,32,38,0.6)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};
