import React from 'react';
import { useStore } from '../../context/StoreContext';

interface StorefrontHeroProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
}

export const StorefrontHero: React.FC<StorefrontHeroProps> = ({
  onExploreClick,
  onHowItWorksClick,
}) => {
  const { settings, openWhatsAppOrder, products, setCatalogCategory } = useStore();
  const sampleProduct = products[0] || null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#faf8ff] to-[#faf8ff] pt-10 pb-12 border-b border-[#eaedff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-4">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">bolt</span>
              <span>Zero-Friction Social Commerce in Bangladesh</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#131b2e] tracking-tight leading-[1.12] mb-5">
              Discover Quality Essentials{' '}
              <span className="text-[#006d2f] underline decoration-[#25d366]/40 underline-offset-4">
                You'll Love
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
              Browse our hand-picked collection and place your order directly via WhatsApp in seconds. No complex checkout or account registration required.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#006d2f] hover:bg-[#005523] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Products</span>
                <span className="material-symbols-outlined text-[18px]">south</span>
              </button>

              <button
                onClick={onHowItWorksClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#006d2f] text-[20px]">play_circle</span>
                <span>How WhatsApp Ordering Works</span>
              </button>
            </div>

            {/* Quick Explore Category Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-6 sm:mb-0">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">category</span>
                Browse by Category:
              </span>
              {[
                { label: '🎧 Audio & Earbuds', cat: 'electronics' },
                { label: '💡 Home & Living', cat: 'home' },
                { label: '👛 Leather Goods', cat: 'fashion' },
                { label: '⌨️ Desk Gear', cat: 'accessories' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setCatalogCategory(item.cat);
                    onExploreClick();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 transition-colors font-medium shadow-2xs cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Live WhatsApp Chat Mockup Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              {/* WhatsApp Chat Header */}
              <div className="bg-[#f0f2f5] p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006d2f] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    DC
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#131b2e]">{settings.storeName} Official</span>
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 fill">verified</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Typically replies instantly</span>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#25d366]"></div>
              </div>

              {/* Chat Body */}
              <div className="p-4 space-y-3 bg-[#e5ddd5]/30 min-h-[220px] flex flex-col justify-end">
                {/* Outgoing Message (Customer) */}
                <div className="self-end max-w-[85%] bg-[#d9fdd3] text-[#111b21] p-3 rounded-2xl rounded-tr-none shadow-sm text-xs leading-relaxed">
                  <p className="font-medium">
                    Salam! I want to order <strong className="text-slate-900">Wireless Noise-Canceling Earbuds Pro</strong> (৳2,450).
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">Delivery: Dhanmondi, Dhaka.</p>
                  <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">10:42 AM · Sent ✓✓</div>
                </div>

                {/* Incoming Message (Merchant) */}
                <div className="self-start max-w-[88%] bg-white text-[#111b21] p-3 rounded-2xl rounded-tl-none shadow-sm text-xs leading-relaxed border border-slate-100">
                  <p className="font-semibold text-emerald-800">Wa Alaikum Assalam! Order confirmed.</p>
                  <p className="text-slate-700 mt-0.5">
                    Order ID <span className="font-mono font-bold text-slate-900">#DC-8921</span>. Estimated delivery: Tomorrow via Express Courier.
                  </p>
                  <p className="font-bold text-slate-900 mt-1">Cash on Delivery payable: ৳2,510</p>
                  <div className="text-[10px] text-emerald-600 text-right mt-1 font-semibold">10:43 AM · Verified</div>
                </div>

                {/* Delivery Fee Notice Pill */}
                <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[15px] text-emerald-700">local_shipping</span>
                    <span>Standard Express Courier</span>
                  </div>
                  <span className="font-bold text-emerald-700">৳60 Delivery Inside Dhaka</span>
                </div>
              </div>

              {/* Chat Interactive Footer / Quick Action */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 font-medium">Want to experience this live?</span>
                {sampleProduct && (
                  <button
                    onClick={() => openWhatsAppOrder(sampleProduct, 'Matte Black')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-bold text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">chat</span>
                    <span>Test WhatsApp Order</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Pillars Strip (Matching Image 4) */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#131b2e]">Instant Chat Response</h2>
              <p className="text-[11px] text-slate-500">Live operators on WhatsApp</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#131b2e]">Nationwide Delivery</h2>
              <p className="text-[11px] text-slate-500">64 districts covered quickly</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#131b2e]">Cash on Delivery</h2>
              <p className="text-[11px] text-slate-500">Pay after product inspection</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#131b2e]">Genuine Quality</h2>
              <p className="text-[11px] text-slate-500">7-day replacement warranty</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
