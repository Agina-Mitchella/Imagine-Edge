import React, { useState, useEffect } from 'react';

export const OFFICIAL_LOGO_URL = '/assets/aistudio/Imaginedge_logo_png_8a71b53f.png';

interface LogoProps {
  variant?: 'dark' | 'light';
  isCompact?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  isCompact = false,
  className = '',
  showTagline = true,
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-ink';
  const subtextColor = isLight ? 'text-white/80' : 'text-slate-500';

  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('imaginedge_custom_logo');
    } catch {
      return null;
    }
  });

  const [logoHeight, setLogoHeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('imaginedge_custom_logo_height');
      return saved ? Number(saved) : 42;
    } catch {
      return 42;
    }
  });

  const [customTaglinePref, setCustomTaglinePref] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('imaginedge_custom_logo_tagline');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const handleLogoUpdate = () => {
      try {
        const saved = localStorage.getItem('imaginedge_custom_logo');
        const savedH = localStorage.getItem('imaginedge_custom_logo_height');
        const savedT = localStorage.getItem('imaginedge_custom_logo_tagline');
        setCustomLogo(saved);
        if (savedH) setLogoHeight(Number(savedH));
        if (savedT !== null) setCustomTaglinePref(savedT === 'true');
      } catch {
        // no-op
      }
    };

    window.addEventListener('imaginedge_logo_updated', handleLogoUpdate);
    return () => window.removeEventListener('imaginedge_logo_updated', handleLogoUpdate);
  }, []);

  const activeLogo = customLogo || OFFICIAL_LOGO_URL;
  const isOfficial = activeLogo === OFFICIAL_LOGO_URL;

  // Responsive calculated height: slightly more compact on scroll
  const effectiveHeight = isCompact ? Math.min(logoHeight, 34) : logoHeight;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <img
        src={activeLogo}
        alt="Imaginedge Solutions - Your promotional items guru"
        style={{ height: `${effectiveHeight}px` }}
        className={`w-auto object-contain transition-all duration-300 ${
          isLight ? 'brightness-0 invert drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]' : 'drop-shadow-xs'
        }`}
      />

      {/* If user uploaded a custom separate icon/mark and wants secondary text displayed */}
      {!isOfficial && showTagline && customTaglinePref && !isCompact && (
        <div
          className={`hidden sm:flex flex-col justify-center border-l ${
            isLight ? 'border-white/20' : 'border-slate-200/80'
          } pl-2.5 ml-1`}
        >
          <span
            className={`font-black tracking-tight uppercase ${textColor} text-xs sm:text-sm leading-tight`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Imaginedge Solutions
          </span>
          <span className={`${subtextColor} text-[10px] leading-tight`}>
            Your promotional items guru
          </span>
        </div>
      )}
    </div>
  );
};
