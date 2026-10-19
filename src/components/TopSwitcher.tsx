import React from 'react';
import { useStore } from '../context/StoreContext';

export const TopSwitcher: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    isAuthenticated,
    setSelectedProductId,
    products,
    currentUser,
  } = useStore();

  return (
    <div className="bg-[#111827] text-white border-b border-slate-800 px-4 py-1.5 text-xs flex items-center justify-between gap-3 relative z-50">
      <div className="flex items-center gap-2 shrink-0">
        <span className="inline-block w-2 h-2 rounded-full bg-[#25d366] animate-pulse"></span>
        <span className="font-semibold text-slate-300 hidden sm:inline">Preview Mode:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
        <button
          onClick={() => setViewMode('storefront')}
          className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
            viewMode === 'storefront'
              ? 'bg-[#25d366] text-[#003816] shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">storefront</span>
          <span>Storefront</span>
        </button>

        <button
          onClick={() => {
            if (products.length > 0) {
              setSelectedProductId(products[0].id);
            }
            setViewMode('product-detail');
          }}
          className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
            viewMode === 'product-detail'
              ? 'bg-[#25d366] text-[#003816] shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">info</span>
          <span>Product Detail</span>
        </button>

        <button
          onClick={() => setViewMode('order-tracking')}
          className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
            viewMode === 'order-tracking'
              ? 'bg-[#25d366] text-[#003816] shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">local_shipping</span>
          <span>Order Tracking</span>
        </button>

        <button
          onClick={() => setViewMode('admin-login')}
          className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
            viewMode === 'admin-login'
              ? 'bg-[#25d366] text-[#003816] shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <span>Admin Login</span>
        </button>

        <button
          onClick={() => setViewMode('admin-panel')}
          className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
            viewMode === 'admin-panel'
              ? 'bg-[#25d366] text-[#003816] shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">dashboard</span>
          <span>Admin Panel</span>
          {isAuthenticated && (
            <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1 py-0.2 rounded font-mono">
              {currentUser ? currentUser.name.split(' ')[0] : 'Auth'}
            </span>
          )}
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[11px] shrink-0">
        <span className="text-emerald-400 font-mono">DokanChat Engine v1.2</span>
      </div>
    </div>
  );
};
