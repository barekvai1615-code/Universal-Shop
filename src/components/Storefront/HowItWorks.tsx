import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works-section" className="py-16 bg-[#faf8ff] border-b border-[#eaedff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006d2f] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 inline-block mb-3">
            Frictionless Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight mb-3">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            No forgotten passwords, abandoned carts, or endless checkout forms. Shop directly through Bangladesh's favorite messaging platform.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-emerald-600/40 font-mono">01</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#131b2e] mb-2">Browse &amp; Pick Your Product</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Explore carefully tested gadgets, lifestyle items, and essentials with transparent Bangladeshi Taka (৳) prices.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 pt-3 border-t border-slate-100">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Clear specifications &amp; prices</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-emerald-600/40 font-mono">02</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#131b2e] mb-2">Click 'Order on WhatsApp'</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                One tap auto-formats a detailed order text including product name, price, SKU, and direct product link ready to send.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 pt-3 border-t border-slate-100">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Zero manual typing required</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-emerald-600/40 font-mono">03</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">forum</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#131b2e] mb-2">Confirm Delivery &amp; Pay</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Chat with a real representative to finalize your address, choose Cash on Delivery or bKash/Nagad, and receive instant tracking.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 pt-3 border-t border-slate-100">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Real-time human support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
