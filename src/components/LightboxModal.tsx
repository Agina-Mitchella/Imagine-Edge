import React, { useEffect } from 'react';
import { X, Send, Sparkles, Clock, CheckCircle } from 'lucide-react';

interface LightboxItem {
  title: string;
  client: string;
  specs: string;
  image: string;
  materials?: string;
  category?: string;
  leadTime?: string;
}

interface LightboxModalProps {
  item: LightboxItem | null;
  onClose: () => void;
  onRequestQuote: (itemTitle: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  onClose,
  onRequestQuote,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && item) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      <div className="relative w-full max-w-4xl bg-[#15171A] border border-white/20 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col md:flex-row max-h-[92vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Container */}
        <div className="md:w-7/12 relative aspect-[16/10] md:aspect-auto min-h-[300px] md:min-h-[460px] bg-[#0E1013] overflow-hidden flex items-center justify-center p-4 sm:p-6">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto max-w-full object-contain object-center drop-shadow-2xl"
            />
          ) : (
            <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center p-8 text-center text-charcoal">
              <span className="text-base sm:text-lg font-bold font-mono tracking-wide text-slate-700">
                {item.title.split(',')[0]}
              </span>
              <span className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">
                Photo Placeholder
              </span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="md:w-5/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red text-white">
                {item.category || 'Promotional Item'}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {item.client}
              </span>
            </div>

            <h3 id="lightbox-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {item.title}
            </h3>

            {item.specs && (
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                {item.specs}
              </p>
            )}

            {/* Technical specs breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-300">
              {item.materials && (
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Materials & Finish:</strong> {item.materials}
                  </span>
                </div>
              )}
              {item.leadTime && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-red shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Standard Lead Time:</strong> {item.leadTime}
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-red shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Branding Methods:</strong> Screen printing, laser
                  etching, heat transfer or 3D embroidery available.
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestQuote(item.title);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-red hover:bg-red-hover text-white font-bold text-sm shadow-xl active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Send className="w-4 h-4" />
              <span>Contact us for this item</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              Direct delivery across Nairobi CBD, Industrial Area, and nation-wide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
