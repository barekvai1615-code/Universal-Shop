import React from 'react';
import { useStore } from '../context/StoreContext';

export const TopSwitcher: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    isAuthenticated,
    setSelectedProductId,
    products,
    openLoginGuide,
    currentUser,
    currentCustomer,
    openCustomerLogin,
    openCustomerAccount,
    wishlistProductIds,
    openWishlist,
  } = useStore();

  return (
    <div className="bg-[#131b2e] text-white border-b border-[#283044] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#25d366]"></span>
        <span className="font-semibold text-slate-200">DokanChat Applet View:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <button
          onClick={() => setViewMode('storefront')}
          className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            viewMode === 'storefront'
              ? 'bg-[#25d366] text-[#003816] font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">storefront</span>
          <span>1. Storefront Home</span>
        </button>

        <button
          onClick={() => {
            if (products.length > 0) {
              setSelectedProductId(products[0].id);
            }
            setViewMode('product-detail');
          }}
          className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            viewMode === 'product-detail'
              ? 'bg-[#25d366] text-[#003816] font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">info</span>
          <span>2. Product Detail</span>
        </button>

        <button
          onClick={() => setViewMode('order-tracking')}
          className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            viewMode === 'order-tracking'
              ? 'bg-[#25d366] text-[#003816] font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">local_shipping</span>
          <span>3. Live Order Tracking</span>
        </button>

        <button
          onClick={() => setViewMode('admin-login')}
          className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            viewMode === 'admin-login'
              ? 'bg-[#25d366] text-[#003816] font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">lock</span>
          <span>4. Admin Login</span>
        </button>

        <button
          onClick={() => setViewMode('admin-panel')}
          className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            viewMode === 'admin-panel'
              ? 'bg-[#25d366] text-[#003816] font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">dashboard</span>
          <span>5. Admin Panel</span>
          {isAuthenticated && (
            <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded font-mono">
              {currentUser ? currentUser.name.split(' ')[0] : 'Live'}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3 text-slate-400 text-[11px]">
        {/* Customer indicator in switcher */}
        {currentCustomer ? (
          <button
            type="button"
            onClick={openCustomerAccount}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 hover:text-emerald-100 cursor-pointer"
            title="Logged in as customer. Click to manage account."
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]"></span>
            <span>Customer: <strong>{currentCustomer.name.split(' ')[0]}</strong></span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openCustomerLogin('login')}
            className="text-slate-300 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">account_circle</span>
            <span>Customer Login</span>
          </button>
        )}

        {/* Wishlist in TopSwitcher */}
        <button
          type="button"
          onClick={openWishlist}
          className="text-slate-300 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
          title={`View Wishlist (${wishlistProductIds.length} items)`}
        >
          <span className={`material-symbols-outlined text-[14px] ${wishlistProductIds.length > 0 ? 'text-rose-400 fill' : 'text-slate-400'}`}>
            favorite
          </span>
          <span>Wishlist ({wishlistProductIds.length})</span>
        </button>

        <button
          type="button"
          onClick={openLoginGuide}
          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold hover:underline cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">help_center</span>
          <span>How to Login</span>
        </button>
      </div>
    </div>
  );
};

