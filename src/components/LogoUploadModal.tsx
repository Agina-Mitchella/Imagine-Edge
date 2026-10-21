import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  X,
  Sliders,
  Sun,
  Moon,
  Sparkles,
  Info,
  ArrowRight,
} from 'lucide-react';
import { Logo } from './Logo';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({ isOpen, onClose }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoHeight, setLogoHeight] = useState<number>(38);
  const [showTagline, setShowTagline] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing custom logo on open
  useEffect(() => {
    if (isOpen) {
      try {
        const savedLogo = localStorage.getItem('imaginedge_custom_logo');
        const savedHeight = localStorage.getItem('imaginedge_custom_logo_height');
        const savedTagline = localStorage.getItem('imaginedge_custom_logo_tagline');

        if (savedLogo) {
          setLogoPreview(savedLogo);
        } else {
          setLogoPreview(null);
        }

        if (savedHeight) {
          setLogoHeight(Number(savedHeight));
        } else {
          setLogoHeight(38);
        }

        if (savedTagline !== null) {
          setShowTagline(savedTagline === 'true');
        }
      } catch {
        // no-op
      }
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, or WebP).');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      setIsSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveLogo = () => {
    try {
      if (logoPreview) {
        localStorage.setItem('imaginedge_custom_logo', logoPreview);
        localStorage.setItem('imaginedge_custom_logo_height', logoHeight.toString());
        localStorage.setItem('imaginedge_custom_logo_tagline', showTagline ? 'true' : 'false');
      } else {
        localStorage.removeItem('imaginedge_custom_logo');
        localStorage.removeItem('imaginedge_custom_logo_height');
        localStorage.removeItem('imaginedge_custom_logo_tagline');
      }

      window.dispatchEvent(new Event('imaginedge_logo_updated'));
      setIsSaved(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch {
      alert('Failed to save logo to local storage. File might be too large.');
    }
  };

  const handleResetToDefault = () => {
    try {
      localStorage.removeItem('imaginedge_custom_logo');
      localStorage.removeItem('imaginedge_custom_logo_height');
      localStorage.removeItem('imaginedge_custom_logo_tagline');
      setLogoPreview(null);
      setFileName('');
      window.dispatchEvent(new Event('imaginedge_logo_updated'));
      setIsSaved(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch {
      // no-op
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logo-upload-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white text-ink rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red/10 text-red flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 id="logo-upload-title" className="text-lg font-extrabold text-ink leading-tight">
                Upload Brand Logo
              </h3>
              <p className="text-xs text-slate-500">
                Replace or customize the Imaginedge Solutions logo across the app
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-ink hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-red bg-red/5 scale-[1.01]'
                : 'border-slate-200 hover:border-red/60 hover:bg-slate-50/70 bg-slate-50/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-red mb-3">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-ink mb-1">
              {fileName ? fileName : 'Click to browse or drag & drop your logo here'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Supports transparent SVG, PNG, JPG or WebP. Transparent vector or high-resolution PNG looks best on both light & dark themes.
            </p>
          </div>

          {/* Live Preview Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Preview
              </span>
              <span className="text-xs text-slate-400">
                {logoPreview ? 'Custom uploaded logo' : 'Default brand logo'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Preview 1: Light Navigation Background */}
              <div className="rounded-2xl p-4 bg-white border border-slate-200 shadow-sm flex flex-col justify-between min-h-[110px]">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Header Bar (Light)
                  </span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                    Navbar
                  </span>
                </div>
                <div className="flex items-center justify-start py-2">
                  {logoPreview ? (
                    <div className="flex items-center gap-2.5">
                      <img
                        src={logoPreview}
                        alt="Logo preview light"
                        style={{ height: `${logoHeight}px` }}
                        className="w-auto object-contain"
                      />
                      {showTagline && (
                        <div className="hidden sm:flex flex-col border-l border-slate-200 pl-2.5">
                          <span className="font-extrabold text-xs uppercase tracking-tight text-ink">
                            Imaginedge Solutions
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Your promotional items guru.
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Logo variant="dark" />
                  )}
                </div>
              </div>

              {/* Preview 2: Dark Footer Background */}
              <div className="rounded-2xl p-4 bg-[#111317] border border-slate-800 shadow-sm flex flex-col justify-between min-h-[110px]">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Moon className="w-3.5 h-3.5 text-indigo-400" /> Footer (Dark)
                  </span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                    Dark Section
                  </span>
                </div>
                <div className="flex items-center justify-start py-2">
                  {logoPreview ? (
                    <div className="flex items-center gap-2.5">
                      <img
                        src={logoPreview}
                        alt="Logo preview dark"
                        style={{ height: `${logoHeight}px` }}
                        className="w-auto object-contain"
                      />
                      {showTagline && (
                        <div className="hidden sm:flex flex-col border-l border-white/20 pl-2.5">
                          <span className="font-extrabold text-xs uppercase tracking-tight text-white">
                            Imaginedge Solutions
                          </span>
                          <span className="text-[10px] text-white/70">
                            Your promotional items guru.
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Logo variant="light" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sizing & Tagline Controls */}
          {logoPreview && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" /> Adjust Display Height
                </span>
                <span className="text-xs font-semibold text-red">{logoHeight}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="60"
                step="2"
                value={logoHeight}
                onChange={(e) => setLogoHeight(Number(e.target.value))}
                className="w-full accent-red cursor-pointer"
              />
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={showTagline}
                    onChange={(e) => setShowTagline(e.target.checked)}
                    className="accent-red rounded"
                  />
                  <span>Show brand text & tagline alongside logo</span>
                </label>
              </div>
            </div>
          )}

          {/* Quick Chat Instruction Tip */}
          <div className="p-3.5 bg-red/5 rounded-2xl border border-red/15 flex items-start gap-3 text-xs text-slate-700">
            <Info className="w-4 h-4 text-red shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-ink">Prefer to have the logo permanently embedded?</p>
              <p className="text-slate-600">
                You can also drag and drop or attach your logo image directly into our AI Studio conversation. I will place it straight into the project’s permanent assets directory and configure it globally!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          <div>
            {logoPreview && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset to default</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveLogo}
              disabled={isSaved}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red text-white text-xs font-bold hover:bg-red-hover transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-75"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Applied Everywhere!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save & Apply Logo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
