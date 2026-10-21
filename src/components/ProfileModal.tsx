import React, { useState } from 'react';
import {
  X,
  FileDown,
  ShieldCheck,
  Printer,
  Check,
  Building,
  Phone,
  Mail,
  FileText,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  COMPANY_PROFILE_PDF_URL,
  downloadCompanyProfilePdf,
  openCompanyProfileInNewTab,
  getCompanyProfileBlob,
} from '../utils/pdfDownload';
import { Logo } from './Logo';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenQuote,
}) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'summary'>('pdf');
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [openingNewTab, setOpeningNewTab] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(COMPANY_PROFILE_PDF_URL);

  React.useEffect(() => {
    let isMounted = true;
    if (isOpen && activeTab === 'pdf') {
      getCompanyProfileBlob()
        .then(({ url }) => {
          if (isMounted) setPreviewUrl(url);
        })
        .catch(() => {
          // Keep COMPANY_PROFILE_PDF_URL as fallback
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadProgress(0);
    try {
      await downloadCompanyProfilePdf((percent) => {
        setDownloadProgress(percent);
      });
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  const handleOpenNewTab = async () => {
    if (openingNewTab) return;
    setOpeningNewTab(true);
    try {
      await openCompanyProfileInNewTab();
    } finally {
      setOpeningNewTab(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 max-h-[95vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 z-10"
          aria-label="Close profile modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Brand */}
        <div className="pb-4 border-b border-slate-200 pr-10">
          <div className="flex items-center justify-between gap-4 mb-2">
            <Logo variant="dark" isCompact={true} showTagline={false} />
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-red">
                Corporate Capabilities
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h2 id="profile-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-950">
              Imaginedge Solution Limited
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Incorporated 2019 · Nairobi, Kenya
            </span>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => setActiveTab('pdf')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'pdf'
                  ? 'bg-red text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Document Reader</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'summary'
                  ? 'bg-red text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Credentials Summary</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 min-h-[360px]">
          {activeTab === 'pdf' ? (
            <div className="flex flex-col h-full space-y-3">
              {/* Document Banner & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-4 h-4 text-red shrink-0" />
                  <span className="font-semibold text-slate-900">
                    Imaginedge_Company_Profile_2026.pdf
                  </span>
                  <span className="hidden sm:inline text-slate-400">·</span>
                  <span className="text-slate-500 hidden sm:inline">18 Pages (8.2 MB)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenNewTab}
                    disabled={openingNewTab}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-all cursor-pointer disabled:opacity-75"
                    title="Open PDF in a full new tab window"
                  >
                    {openingNewTab ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" />
                    )}
                    <span>Open Fullscreen</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red hover:bg-red-hover text-white font-bold text-xs transition-all shadow-sm active:scale-95 disabled:opacity-75 cursor-pointer"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving {downloadProgress > 0 ? `${downloadProgress}%` : '...'}</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Embedded PDF Viewer Container */}
              <div className="relative w-full h-[58vh] min-h-[380px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  src={`${previewUrl}#view=FitH`}
                  className="w-full h-full border-0 rounded-xl"
                  title="Imaginedge Company Profile 2026 Document"
                  loading="lazy"
                />
              </div>

              {/* Helper text */}
              <p className="text-[11px] text-slate-500 text-center font-normal">
                If the document preview is loading or your device does not support inline PDF viewing,{' '}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="text-red font-semibold underline hover:text-red-hover"
                >
                  click here to download the file directly to your device
                </button>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed pr-1">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Executive Summary</h3>
                <p>
                  Imaginedge Solutions is a Kenyan-owned corporate promotional items, branded merchandise,
                  and commercial printing enterprise headquartered at Vision Plaza, Aghakhan Walk, Nairobi
                  CBD. We manage end-to-end design, digital pre-press, volume printing, precision
                  embroidery, and nationwide distribution.
                </p>
              </div>

              {/* Institutional Compliance */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red" />
                  Institutional & Procurement Credentials
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Incorporated under Kenya Companies Act (2019)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>VAT & Tax Compliant (KRA PIN & e-TIMS registered)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>AGPO Registered Enterprise (Youth Category)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Standard Vendor to NGOs, Banking & State Agencies</span>
                  </li>
                </ul>
              </div>

              {/* Plant & Machinery Overview */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-red" />
                  Production Capacity & Machinery
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  Our Nairobi workshop operates high-duty digital printers, rotary thermal presses,
                  automatic screen-printing carousels, and computerized multi-head embroidery stations:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-semibold mb-1">Textile & Apparel</strong>
                    <span>Up to 3,500 branded garments / week with plastisol & waterbase inks</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-semibold mb-1">Drinkware & Gifts</strong>
                    <span>CO2 and fiber laser engraving with sub-millimeter precision</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="block text-slate-900 font-semibold mb-1">Large Format Display</strong>
                    <span>High-resolution UV & solvent print lines for roll-ups & flags</span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-red" />
                  <span>Vision Plaza, Aghakhan Walk, Nairobi CBD</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red" />
                  <span>0710 428 485 / +254 710 428 485</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red" />
                  <span>jmutitu@imaginedgesolutions.co.ke</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5 justify-end">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-75"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-red" />
                <span>Downloading {downloadProgress > 0 ? `(${downloadProgress}%)` : '...'}</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-red" />
                <span>Download Profile (PDF)</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenQuote();
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-red hover:bg-red-hover text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <span>Request Proposal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
