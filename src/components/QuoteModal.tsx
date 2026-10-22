import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Phone, Mail, Instagram, Globe, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { getGlobalLenis } from '../utils/scrollHelper';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategory?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedCategory,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    organisation: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (preselectedCategory && !formData.notes) {
      setFormData((prev) => ({
        ...prev,
        notes: `Inquiry regarding: ${preselectedCategory}`,
      }));
    }
  }, [preselectedCategory, isOpen]);

  // Stop Lenis inertia and lock body scroll when open
  useEffect(() => {
    const lenis = getGlobalLenis();
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sheetRef = useRef<HTMLDivElement>(null);

  // Smooth entrance animation: desktop fade + mobile bottom sheet slide up
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    const sheet = sheetRef.current;
    if (!modal) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;

    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });

    if (isMobile && sheet) {
      gsap.fromTo(
        sheet,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.organisation.trim()) newErrors.organisation = 'Organisation is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      newErrors.email = 'Valid email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const message = `Hello Imaginedge Solutions! I would like to get in touch:
*Client Name:* ${formData.name}
*Organisation:* ${formData.organisation}
*Phone:* ${formData.phone}
*Email:* ${formData.email}
*Message / Notes:* ${formData.notes || 'None provided'}
------------------------------------------------
Sent from imaginedgesolutions.co.ke`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/254710428485?text=${encodedMessage}`;

    setIsSuccess(true);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDirectWhatsApp = () => {
    const url = 'https://wa.me/254710428485?text=Hello%20Imaginedge%20Solutions%2C%20I%20would%20like%20to%20get%20a%20quote.';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDirectEmail = () => {
    window.location.href = 'mailto:jmutitu@imaginedgesolutions.co.ke?subject=Quote%20Inquiry%20-%20Imaginedge%20Solutions';
  };

  return (
    <div
      ref={modalRef}
      data-lenis-prevent
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/80 backdrop-blur-xs flex flex-col justify-end md:justify-start"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-section-heading"
    >
      {/* Mobile: Bottom sheet sliding up with rounded top / Desktop: full section */}
      <div
        ref={sheetRef}
        className="relative w-full max-h-[92dvh] md:max-h-none md:min-h-screen bg-[#921B1D] text-white rounded-t-3xl md:rounded-none overflow-y-auto overscroll-contain py-6 md:py-[64px] lg:py-[96px] px-4 sm:px-6 lg:px-8 font-poppins shrink-0 shadow-2xl"
      >
        {/* Mobile Pull-Down Handle Bar */}
        <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-4 md:hidden" />

        {/* Faint tribal zigzag pattern at ~8% contrast */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L30 20 L20 10 L10 20 L0 20 Z M20 20 L40 40 L30 40 L20 30 L10 40 L0 40 Z' fill='%23FFFFFF' /%3E%3C/svg%3E")`,
            backgroundSize: '36px 36px',
          }}
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
          aria-label="Close quote modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Two Columns on Desktop (text left, form right), Stacked on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT COLUMN (white text) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Small label: "CONTACT" */}
              <span className="text-[12px] font-bold uppercase tracking-widest text-white/80 block">
                CONTACT
              </span>

              {/* Heading (Poppins ExtraBold, clamp 2.5rem to 4.5rem, fully visible, no overlap with anything) */}
              <h2
                id="contact-section-heading"
                className="font-extrabold text-[clamp(2.5rem,4.5vw,4.5rem)] text-white tracking-tight leading-[1.08]"
              >
                Tell us what you need printed.
              </h2>

              {/* Paragraph */}
              <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Send quantities, deadlines and artwork if you have it. We'll reply with a design direction and a quote.
              </p>

              {/* Contact list: each line with a thin white icon and a large underlined link */}
              <div className="space-y-4 pt-2">
                {/* Phone / WhatsApp */}
                <div className="flex items-center gap-3.5">
                  <Phone className="w-5 h-5 text-white shrink-0 stroke-[1.5]" />
                  <div className="flex items-center gap-3">
                    <a
                      href="tel:0710428485"
                      className="text-lg sm:text-xl font-semibold text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                    >
                      0710 428 485
                    </a>
                    <span className="text-white/50">/</span>
                    <a
                      href="https://wa.me/254710428485"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white/90 underline underline-offset-2 hover:text-white"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3.5">
                  <Mail className="w-5 h-5 text-white shrink-0 stroke-[1.5]" />
                  <a
                    href="mailto:jmutitu@imaginedgesolutions.co.ke"
                    className="text-base sm:text-lg lg:text-xl font-semibold text-white underline underline-offset-4 hover:text-white/80 transition-colors break-all"
                  >
                    jmutitu@imaginedgesolutions.co.ke
                  </a>
                </div>

                {/* Instagram */}
                <div className="flex items-center gap-3.5">
                  <Instagram className="w-5 h-5 text-white shrink-0 stroke-[1.5]" />
                  <a
                    href="https://instagram.com/imaginedgesolutions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg sm:text-xl font-semibold text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                  >
                    @imaginedgesolutions
                  </a>
                </div>

                {/* Website */}
                <div className="flex items-center gap-3.5">
                  <Globe className="w-5 h-5 text-white shrink-0 stroke-[1.5]" />
                  <a
                    href="https://www.imaginedgesolutions.co.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg sm:text-xl font-semibold text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                  >
                    www.imaginedgesolutions.co.ke
                  </a>
                </div>

                {/* Office */}
                <div className="flex items-start gap-3.5 pt-1">
                  <MapPin className="w-5 h-5 text-white shrink-0 stroke-[1.5] mt-1" />
                  <span className="text-base sm:text-lg font-semibold text-white underline underline-offset-4">
                    Vision Plaza, Aghakhan Walk, Nairobi CBD
                  </span>
                </div>
              </div>

              {/* Two buttons: solid #B52026 pill "Get a quote on WhatsApp", outlined white pill "Email us" */}
              <div className="flex flex-wrap items-center gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="px-7 py-3.5 rounded-full bg-[#B52026] text-white font-bold text-sm tracking-wide shadow-lg hover:bg-[#9C1A1F] transition-all cursor-pointer active:scale-95 border border-[#B52026]"
                >
                  Get a quote on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleDirectEmail}
                  className="px-7 py-3.5 rounded-full bg-transparent text-white font-bold text-sm tracking-wide border-2 border-white hover:bg-white/10 transition-all cursor-pointer active:scale-95"
                >
                  Email us
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: White rounded card (16px radius, soft shadow) with the quote form */}
            <div className="lg:col-span-6 w-full">
              <div className="rounded-[16px] bg-white text-[#1B1416] p-6 sm:p-8 lg:p-9 shadow-2xl border border-[#E8E1DA]">
                {isSuccess ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1B1416]">Connecting to WhatsApp...</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Your inquiry has been compiled and is opening directly in WhatsApp chat with our Nairobi team (0710 428 485).
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSuccess(false);
                        onClose();
                      }}
                      className="mt-2 px-8 py-3 rounded-full bg-[#B52026] text-white font-bold text-sm hover:bg-[#9C1A1F] transition-colors"
                    >
                      Done & Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
                    {/* Name & Organisation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E8E1DA] text-[#1B1416] text-sm focus:outline-none focus:border-[#B52026] focus:ring-1 focus:ring-[#B52026] transition-all"
                        />
                        {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                          Organisation *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.organisation}
                          onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E8E1DA] text-[#1B1416] text-sm focus:outline-none focus:border-[#B52026] focus:ring-1 focus:ring-[#B52026] transition-all"
                        />
                        {errors.organisation && (
                          <p className="text-xs text-rose-600 mt-1">{errors.organisation}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E8E1DA] text-[#1B1416] text-sm focus:outline-none focus:border-[#B52026] focus:ring-1 focus:ring-[#B52026] transition-all"
                        />
                        {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E8E1DA] text-[#1B1416] text-sm focus:outline-none focus:border-[#B52026] focus:ring-1 focus:ring-[#B52026] transition-all"
                        />
                        {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                      </div>
                    </div>


                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                        Notes
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Artwork details, specific materials, branding location..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E8E1DA] text-[#1B1416] text-sm focus:outline-none focus:border-[#B52026] focus:ring-1 focus:ring-[#B52026] resize-none transition-all"
                      />
                    </div>

                    {/* Submit Button #B52026: "Send via WhatsApp" */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 px-8 rounded-full bg-[#B52026] hover:bg-[#9C1A1F] text-white font-bold text-sm tracking-wide shadow-md transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B52026]"
                      >
                        Send via WhatsApp
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
