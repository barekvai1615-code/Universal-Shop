import React, { useState, useMemo, useRef, useEffect } from 'react';
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
    viewMode,
    setViewMode,
    isAuthenticated,
    currentUser,
    openLoginGuide,
    currentCustomer,
    openCustomerLogin,
    openCustomerAccount,
    catalogSearchQuery,
    setCatalogSearchQuery,
    catalogCategory,
    setCatalogCategory,
    products,
    wishlistProductIds,
    openWishlist,
  } = useStore();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute dynamic category list with counts
  const categories = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>();
    map.set('all', { id: 'all', label: 'All Categories', count: products.length });
    products.forEach((p) => {
      const existing = map.get(p.category);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(p.category, {
          id: p.category,
          label: p.categoryLabel || p.category,
          count: 1,
        });
      }
    });
    return Array.from(map.values());
  }, [products]);

  const activeCategoryLabel = useMemo(() => {
    const found = categories.find((c) => c.id === catalogCategory);
    return found ? found.label : 'All Categories';
  }, [categories, catalogCategory]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (viewMode !== 'storefront') {
      setViewMode('storefront');
      setTimeout(() => {
        onScrollToCatalog?.();
      }, 100);
    } else {
      onScrollToCatalog?.();
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setCatalogCategory(categoryId);
    setIsCategoryMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (viewMode !== 'storefront') {
      setViewMode('storefront');
      setTimeout(() => {
        onScrollToCatalog?.();
      }, 100);
    } else {
      onScrollToCatalog?.();
    }
  };

  const handleNavClick = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  };

  return (
    <header className="w-full bg-white border-b border-[#e2e7ff] sticky top-0 z-40 shadow-xs">

      {/* 2. PRIMARY ROW: LOGO & SEARCH BAR TOGETHER + ACTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* LEFT SECTION: Logo + Integrated Search Bar Grouped Together */}
        <div className="flex items-center gap-4 sm:gap-6 flex-1 max-w-4xl">
          {/* Brand Logo */}
          <div
            onClick={() => {
              setViewMode('storefront');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group select-none"
            title="Go to Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#006d2f] to-[#25d366] flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#131b2e] leading-none">
                  {settings.storeName}
                </h1>
                <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">
                  Direct
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-tight block mt-0.5">
                WhatsApp Commerce
              </span>
            </div>
          </div>

          {/* Search Bar - RIGHT NEXT TO LOGO */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 relative max-w-2xl bg-[#f2f4fc] hover:bg-[#e9ecfa] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-600/30 focus-within:border-emerald-600 rounded-xl border border-slate-200 transition-all shadow-2xs"
          >
            {/* Category Dropdown Filter directly in Search */}
            <div className="relative border-r border-slate-300/70" ref={categoryMenuRef}>
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="h-10 px-3 text-xs font-semibold text-slate-700 hover:text-emerald-800 flex items-center gap-1 bg-transparent cursor-pointer rounded-l-xl whitespace-nowrap"
                title="Filter by category"
              >
                <span className="truncate max-w-[110px]">{activeCategoryLabel}</span>
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  {isCategoryMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Category
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors cursor-pointer ${
                        catalogCategory === cat.id
                          ? 'font-bold text-emerald-800 bg-emerald-50/70'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 relative flex items-center">
              <span className="material-symbols-outlined text-[18px] text-slate-400 ml-3">
                search
              </span>
              <input
                type="text"
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                placeholder="Search products by name, SKU, or specs..."
                className="w-full py-2 px-2.5 text-xs sm:text-sm text-[#131b2e] placeholder-slate-400 bg-transparent focus:outline-none font-medium"
              />
              {catalogSearchQuery && (
                <button
                  type="button"
                  onClick={() => setCatalogSearchQuery('')}
                  className="p-1 mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 cursor-pointer"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Search Action Button */}
            <button
              type="submit"
              className="h-10 px-4 bg-[#006d2f] hover:bg-[#005523] text-white rounded-r-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Search"
            >
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* RIGHT SECTION: User Actions (Wishlist, Account, WhatsApp, Mobile Toggles) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            title="Toggle Search"
            aria-label="Toggle Search"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMobileSearchOpen ? 'close' : 'search'}
            </span>
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={openWishlist}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shadow-2xs group"
            title={`Wishlist (${wishlistProductIds.length} items)`}
            aria-label="Open Wishlist"
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-transform group-hover:scale-110 ${
                wishlistProductIds.length > 0 ? 'text-rose-500 fill' : 'text-slate-600'
              }`}
            >
              favorite
            </span>
            {wishlistProductIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-extrabold min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center shadow-xs">
                {wishlistProductIds.length}
              </span>
            )}
          </button>

          {/* Customer Login / Profile Button */}
          {currentCustomer ? (
            <button
              type="button"
              onClick={openCustomerAccount}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006d2f] font-bold text-xs border border-emerald-300 transition-all cursor-pointer shadow-2xs"
              title="Customer Account"
            >
              <img
                src={
                  currentCustomer.avatarUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${currentCustomer.name}`
                }
                alt={currentCustomer.name}
                className="w-5 h-5 rounded-full object-cover border border-emerald-400"
              />
              <span className="hidden sm:inline truncate max-w-[110px]">
                {currentCustomer.name.split(' ')[0]}
              </span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openCustomerLogin('login')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#006d2f] hover:bg-[#004f21] text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
              title="Customer Login / Register"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span className="hidden sm:inline">Customer Login</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

          {/* Direct WhatsApp Quick Chat (Desktop) */}
          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#006d2f] font-bold text-xs transition-colors"
            title="Chat directly on WhatsApp"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>WhatsApp</span>
          </a>

          {/* Admin Portal Button */}
          {isAuthenticated ? (
            <button
              onClick={() => setViewMode('admin-panel')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              title="Open Admin Dashboard"
            >
              <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse"></span>
              <span>Admin</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('admin-login')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
              title="Staff / Admin Portal"
            >
              <span className="material-symbols-outlined text-[15px] text-slate-500">lock</span>
              <span>Staff</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-[#f2f4fc] hover:bg-[#e2e7ff] text-[#131b2e] cursor-pointer transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH BAR (Visible when toggled on mobile) */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-[#f9fafb]">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-2 bg-white rounded-xl border border-slate-200 text-xs text-[#131b2e] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                autoFocus
              />
              {catalogSearchQuery && (
                <button
                  type="button"
                  onClick={() => setCatalogSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#006d2f] text-white rounded-xl font-bold text-xs shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* 3. DEDICATED MENU BAR ("menu onno jaygay dao") */}
      {/* Kept on its own clear row, completely separate from Logo & Search */}
      <nav className="bg-[#fafbff] border-t border-[#eaedff] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-11 flex items-center justify-between">
          {/* Left: Category Quick Picker + Primary Navigation Links */}
          <div className="flex items-center gap-6">
            {/* All Categories Dropdown Shortcut */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => {
                  setViewMode('storefront');
                  setTimeout(() => onScrollToCatalog?.(), 50);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-emerald-800 py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-700">
                  category
                </span>
                <span>All Categories</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({products.length})
                </span>
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200"></div>

            {/* Main Menu Links */}
            <div className="flex items-center gap-5 text-xs font-bold text-slate-700">
              <button
                onClick={() => {
                  setViewMode('storefront');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer ${
                  viewMode === 'storefront' ? 'text-emerald-800' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  if (viewMode !== 'storefront') {
                    setViewMode('storefront');
                    setTimeout(() => onScrollToCatalog?.(), 100);
                  } else {
                    onScrollToCatalog?.();
                  }
                }}
                className="flex items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                <span>Products Catalog</span>
              </button>

              <button
                onClick={() => setViewMode('order-tracking')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'order-tracking'
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'bg-emerald-100/70 text-emerald-900 hover:bg-emerald-200/80'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>Track Order</span>
              </button>

              <button
                onClick={() => {
                  if (viewMode !== 'storefront') {
                    setViewMode('storefront');
                    setTimeout(() => onScrollToHowItWorks?.(), 100);
                  } else {
                    onScrollToHowItWorks?.();
                  }
                }}
                className="flex items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">help</span>
                <span>How to Order</span>
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Contact Us</span>
              </a>
            </div>
          </div>

          {/* Right: Quick Highlights / Direct Helpline */}
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                verified
              </span>
              <span>100% Genuine Guaranteed</span>
            </span>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE MENU DRAWER (When hamburger is clicked) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* Quick Menu Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
              Menu Navigation
            </div>
            <button
              onClick={() =>
                handleNavClick(() => {
                  setViewMode('storefront');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                })
              }
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-700">home</span>
              <span>Home</span>
            </button>

            <button
              onClick={() =>
                handleNavClick(() => {
                  if (viewMode !== 'storefront') {
                    setViewMode('storefront');
                    setTimeout(() => onScrollToCatalog?.(), 100);
                  } else {
                    onScrollToCatalog?.();
                  }
                })
              }
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-700">
                inventory_2
              </span>
              <span>Products Catalog</span>
              <span className="ml-auto text-xs bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded-full">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => handleNavClick(() => setViewMode('order-tracking'))}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-2.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-700">
                local_shipping
              </span>
              <span>Track Order Live</span>
            </button>

            <button
              onClick={() =>
                handleNavClick(() => {
                  if (viewMode !== 'storefront') {
                    setViewMode('storefront');
                    setTimeout(() => onScrollToHowItWorks?.(), 100);
                  } else {
                    onScrollToHowItWorks?.();
                  }
                })
              }
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-700">
                help
              </span>
              <span>How to Order via WhatsApp</span>
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 block"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-700">
                chat
              </span>
              <span>Contact Helpline ({settings.formattedNumber})</span>
            </a>
          </div>

          {/* Categories in Mobile Menu */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Categories
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between border cursor-pointer ${
                    catalogCategory === cat.id
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                  <span className="text-[10px] opacity-80 font-mono ml-1">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Staff & Admin links in Mobile Menu */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => handleNavClick(openLoginGuide)}
              className="text-slate-600 hover:text-emerald-800 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">help_center</span>
              <span>How to Login Guide</span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => handleNavClick(() => setViewMode('admin-panel'))}
                className="text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Dashboard ({currentUser?.name.split(' ')[0]})</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick(() => setViewMode('admin-login'))}
                className="text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Staff Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
