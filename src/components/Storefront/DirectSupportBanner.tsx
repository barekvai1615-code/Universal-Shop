import React from 'react';
import { useStore } from '../../context/StoreContext';

export const DirectSupportBanner: React.FC = () => {
  const { settings } = useStore();

  return (
    <section className="py-12 bg-white border-t border-b border-[#eaedff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-emerald-100/40 to-teal-50/60 border border-emerald-200/60 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200/50 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#25d366]"></span>
              <span>Direct Support Live</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight mb-2">
              Have Questions Before Ordering?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Not sure about sizing, compatibility, or delivery schedule in your Thana? Chat directly with our Dhaka shop manager on WhatsApp for immediate photos, specs, and order booking.
            </p>
          </div>

          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-6 py-4 rounded-xl bg-[#006d2f] hover:bg-[#005523] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">chat</span>
            <span>Chat with Shop Manager ({settings.formattedNumber})</span>
          </a>
        </div>
      </div>
    </section>
  );
};
