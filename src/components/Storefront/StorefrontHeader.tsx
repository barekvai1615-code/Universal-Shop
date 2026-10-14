import React from 'react';
import { useStore } from '../../context/StoreContext';

interface StorefrontHeaderProps {
  onScrollToCatalog?: () => void;
  onScrollToHowItWorks?: () => void;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({
  onScrollToCatalog,
  onScrollToHowItWorks,
}) => {
  const {
    settings,
    setViewMode,
    isAuthenticated,
    currentUser,
    openLoginGuide,
    currentCustomer,
    openCustomerLogin,
    openCustomerAccount,
    catalogSearchQuery,
    setCatalogSearchQuery,
    searchCatalog,
    wishlistProductIds,
    openWishlist,
  } = useStore();

  return (
    <header className="w-full bg-white border-b border-[#eaedff] sticky top-[37px] z-40">
      {/* Top Announcement Bar */}
      <div className="bg-[#f2f3ff] text-[#3c4a3d] border-b border-[#eaedff] text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="font-semibold text-emerald-800">🇧🇩 Nationwide Delivery</span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="hidden sm:inline">Direct WhatsApp Order &amp; Fast Confirmation</span>
        </div>
        <div className="hidden sm:flex items-center gap-3.5 text-xs font-medium">
          {currentCustomer ? (
            <button
              type="button"
              onClick={openCustomerAccount}
              className="text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 font-bold cursor-pointer hover:underline"
            >
              <span className="w-2 h-2 rounded-full bg-[#25d366]"></span>
              <span>Account: {currentCustomer.name}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openCustomerLogin('login')}
              className="text-emerald-800 hover:text-emerald-950 flex items-center gap-1 font-bold cursor-pointer hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">account_circle</span>
              <span>Customer Login</span>
            </button>
          )}
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={openWishlist}
            className="text-slate-600 hover:text-rose-600 flex items-center gap-1 font-semibold cursor-pointer hover:underline"
            title="Open Wishlist"
          >
            <span className={`material-symbols-outlined text-[14px] ${wishlistProductIds.length > 0 ? 'text-rose-500 fill' : 'text-slate-400'}`}>
              favorite
            </span>
            <span>Wishlist ({wishlistProductIds.length})</span>
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={openLoginGuide}
            className="text-slate-600 hover:text-emerald-950 flex items-center gap-1 font-semibold cursor-pointer hover:underline"
          >
            <span className="material-symbols-outlined text-[14px]">help_center</span>
            <span>How to Login</span>
          </button>
          <span className="text-slate-300">·</span>
          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-[14px]">chat</span>
            <span>Helpline: {settings.formattedNumber}</span>
          </a>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setViewMode('storefront')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#006d2f] to-[#25d366] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#131b2e] leading-none">
              {settings.storeName}
            </h1>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Direct-to-WhatsApp Storefront
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
          <button
            onClick={() => setViewMode('storefront')}
            className="hover:text-emerald-700 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={onScrollToCatalog}
            className="hover:text-emerald-700 transition-colors cursor-pointer"
          >
            Products
          </button>
          <button
            onClick={onScrollToHowItWorks}
            className="hover:text-emerald-700 transition-colors cursor-pointer"
          >
            How to Order
          </button>
          <button
            onClick={() => setViewMode('order-tracking')}
            className="text-emerald-800 hover:text-emerald-950 font-bold transition-colors cursor-pointer flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60"
          >
            <span className="material-symbols-outlined text-[15px]">local_shipping</span>
            <span>Track Order</span>
          </button>
          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-700 transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Quick Header Search Bar */}
        <div className="hidden lg:flex items-center relative w-48 xl:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={catalogSearchQuery}
            onChange={(e) => searchCatalog(e.target.value)}
            placeholder="Search catalog..."
            className="w-full pl-9 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-xs text-[#131b2e] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
          />
          {catalogSearchQuery && (
            <button
              type="button"
              onClick={() => setCatalogSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={openWishlist}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer shadow-2xs group"
            title={`Wishlist (${wishlistProductIds.length} saved)`}
            aria-label="Open Wishlist"
          >
            <span
              className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${
                wishlistProductIds.length > 0 ? 'text-rose-500 fill' : 'text-slate-600'
              }`}
            >
              favorite
            </span>
            {wishlistProductIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                {wishlistProductIds.length}
              </span>
            )}
          </button>

          {/* Customer Login / Account Button */}
          {currentCustomer ? (
            <button
              type="button"
              onClick={openCustomerAccount}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006d2f] font-bold text-xs border border-emerald-300 transition-all cursor-pointer shadow-2xs"
              title="View Customer Profile & Track Orders"
            >
              <img
                src={currentCustomer.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${currentCustomer.name}`}
                alt={currentCustomer.name}
                className="w-5 h-5 rounded-full object-cover border border-emerald-400"
              />
              <span className="truncate max-w-[100px] sm:max-w-[130px]">{currentCustomer.name.split(' ')[0]}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openCustomerLogin('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006d2f] hover:bg-[#00471c] text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
              title="Customer Login / Register"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span>Customer Login</span>
            </button>
          )}

          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#006d2f] font-semibold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>WhatsApp</span>
          </a>

          {/* Admin / Merchant Portal Button */}
          {isAuthenticated ? (
            <button
              onClick={() => setViewMode('admin-panel')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              title="Open Admin Dashboard"
            >
              <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse"></span>
              <span className="hidden sm:inline">Admin:</span>
              <span className="truncate max-w-[80px]">{currentUser ? currentUser.name.split(' ')[0] : 'Admin'}</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('admin-login')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
              title="Merchant & Staff Login"
            >
              <span className="material-symbols-outlined text-[15px] text-slate-500">lock</span>
              <span className="hidden sm:inline">Staff /</span>
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
