import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-6 right-6 z-40 md:hidden flex items-center justify-center"
    >
      <a
        href="https://wa.me/254710428485?text=Hello%20Imaginedge%20Solutions%2C%20I%20would%20like%20to%20request%20a%20quote%20for%20promotional%20items."
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400"
        aria-label="Chat with Imaginedge Solutions on WhatsApp (0710 428 485)"
      >
        {/* Subtle pulsing indicator ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white" />
        </span>
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </aside>
  );
};
