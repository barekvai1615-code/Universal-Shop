import React from 'react';
import { useStore } from '../../context/StoreContext';

export const StorefrontFooter: React.FC = () => {
  const {
    settings,
    setViewMode,
    isAuthenticated,
    openLoginGuide,
    currentCustomer,
    openCustomerLogin,
    openCustomerAccount,
  } = useStore();

  return (
    <footer className="bg-white border-t border-[#eaedff] pt-14 pb-8 text-[#131b2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#006d2f] text-white flex items-center justify-center font-bold text-xs">
                DC
              </div>
              <span className="font-bold text-lg">{settings.storeName}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Fast, transparent direct-to-WhatsApp conversational commerce crafted for Bangladesh.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">location_on</span>
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <button
                  onClick={() => {
                    setViewMode('storefront');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Browse All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setViewMode('storefront');
                    const el = document.getElementById('how-it-works-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Ordering Guide
                </button>
              </li>
              <li>
                {currentCustomer ? (
                  <button
                    onClick={openCustomerAccount}
                    className="hover:text-emerald-700 transition-colors cursor-pointer text-[#006d2f] font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">account_circle</span>
                    <span>My Customer Account</span>
                  </button>
                ) : (
                  <button
                    onClick={() => openCustomerLogin('login')}
                    className="hover:text-emerald-700 transition-colors cursor-pointer text-[#006d2f] font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    <span>Customer Login / Register</span>
                  </button>
                )}
              </li>
              <li>
                <button
                  onClick={() => {
                    setViewMode('order-tracking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-slate-700 font-medium"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={openLoginGuide}
                  className="hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1 text-slate-700 font-medium"
                >
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">help_center</span>
                  <span>How to Login (Guide)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode(isAuthenticated ? 'admin-panel' : 'admin-login')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-slate-500"
                >
                  {isAuthenticated ? 'Admin Dashboard' : 'Merchant & Staff Login'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Customer Support
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Direct WhatsApp live support available 10:00 AM – 11:00 PM every day.
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#006d2f] text-white text-xs font-bold hover:bg-[#005523] transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>{settings.formattedNumber}</span>
            </a>
          </div>

          {/* Col 4: Payment & Delivery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Payment &amp; Delivery
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Cash on Delivery (Inside &amp; Outside Dhaka) or bKash / Nagad via WhatsApp order confirmation.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
              <span>100% Genuine Products</span>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-6 border-t border-[#eaedff] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} DokanChat. Direct Conversational Commerce Bangladesh. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium">Built for high-trust social shopping.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
