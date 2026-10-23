import React, { useState, useEffect } from 'react';

export const OFFICIAL_LOGO_URL = '/assets/aistudio/Imaginedge_logo_png_8a71b53f.png';
export const HEADER_LOGO_DARK = '/assets/aistudio/logo_header_dark.png';
export const HEADER_LOGO_LIGHT = '/assets/aistudio/logo_header_light.png';
export const HEADER_LOGO_CRIMSON = '/assets/aistudio/logo_header_crimson.png';

interface LogoProps {
  variant?: 'dark' | 'light' | 'crimson';
  isCompact?: boolean;
  className?: string;
  showTagline?: boolean;
  isHeader?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  isCompact = false,
  className = '',
  showTagline = true,
  isHeader = false,
}) => {
  const isLight = variant === 'light';
  const isCrimsonTheme = variant === 'crimson';
  const textColor = isLight ? 'text-ink' : 'text-white';
  const subtextColor = isLight ? 'text-slate-500' : 'text-white/80';

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
      // 20% larger than previous default 42px => 50px
      return saved ? Math.round(Number(saved) * 1.2) : 50;
    } catch {
      return 50;
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
        if (savedH) setLogoHeight(Math.round(Number(savedH) * 1.2));
        if (savedT !== null) setCustomTaglinePref(savedT === 'true');
      } catch {
        // no-op
      }
    };

    window.addEventListener('imaginedge_logo_updated', handleLogoUpdate);
    return () => window.removeEventListener('imaginedge_logo_updated', handleLogoUpdate);
  }, []);

  // Determine which image asset to display
  let logoSrc = customLogo || OFFICIAL_LOGO_URL;

  if (isHeader && !customLogo) {
    if (variant === 'dark') {
      logoSrc = HEADER_LOGO_DARK;
    } else if (variant === 'crimson') {
      logoSrc = HEADER_LOGO_CRIMSON;
    } else {
      logoSrc = HEADER_LOGO_LIGHT;
    }
  }

  const isOfficial = !customLogo;

  // Responsive calculated height (20% larger than before)
  const baseHeight = isCompact ? Math.min(logoHeight, 40) : logoHeight;

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Imaginedge Solutions"
        style={{ height: `${baseHeight}px` }}
        className={`w-auto object-contain transition-all duration-300 ${
          // If custom logo uploaded and dark/crimson theme, invert brightness
          customLogo && (variant === 'dark' || variant === 'crimson')
            ? 'brightness-0 invert drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]'
            : 'drop-shadow-xs'
        }`}
      />

      {/* If user uploaded a custom separate icon/mark and wants secondary text displayed */}
      {!isOfficial && showTagline && customTaglinePref && !isCompact && (
        <div
          className={`hidden sm:flex flex-col justify-center border-l ${
            isLight ? 'border-slate-200/80' : 'border-white/20'
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
