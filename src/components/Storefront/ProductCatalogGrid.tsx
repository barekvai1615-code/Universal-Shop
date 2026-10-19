import React, { useMemo, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

// Helper to highlight search matches
const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query || !query.trim()) {
    return <>{text}</>;
  }

  const trimmedQuery = query.trim();
  const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-amber-100 text-amber-900 rounded-xs px-0.5 font-semibold"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export const ProductCatalogGrid: React.FC = () => {
  const {
    products,
    navigateToProduct,
    openWhatsAppOrder,
    catalogSearchQuery,
    setCatalogSearchQuery,
    catalogCategory,
    setCatalogCategory,
    catalogInStockOnly,
    setCatalogInStockOnly,
    catalogSortBy,
    setCatalogSortBy,
    catalogPriceRange,
    setCatalogPriceRange,
    resetCatalogFilters,
    wishlistProductIds,
    toggleWishlist,
    isInWishlist,
    openWishlist,
  } = useStore();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Category definitions with icons
  const categoryDefs = [
    { id: 'all', label: 'All Products', icon: 'grid_view' },
    { id: 'electronics', label: 'Electronics & Audio', icon: 'headphones' },
    { id: 'home', label: 'Home & Living', icon: 'cottage' },
    { id: 'fashion', label: 'Fashion & Leather', icon: 'shopping_bag' },
    { id: 'accessories', label: 'Desk Accessories', icon: 'keyboard' },
  ];

  // Dynamic counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Quick suggestion tags
  const popularKeywords = [
    { label: 'Earbuds', icon: 'headphones' },
    { label: 'Speaker', icon: 'volume_up' },
    { label: 'Leather', icon: 'wallet' },
    { label: 'Charger', icon: 'bolt' },
    { label: 'Lamp', icon: 'lightbulb' },
    { label: 'Cushion', icon: 'chair' },
  ];

  // Filter and sort products in real-time
  const filteredProducts = useMemo(() => {
    const query = catalogSearchQuery.trim().toLowerCase();

    return products
      .filter((p) => {
        // 1. Category Filter
        if (catalogCategory !== 'all' && p.category !== catalogCategory) {
          return false;
        }

        // 2. In Stock Filter
        if (catalogInStockOnly && !p.inStock) {
          return false;
        }

        // 3. Price Range Filter
        if (catalogPriceRange === 'under-1500' && p.priceBDT >= 1500) {
          return false;
        }
        if (catalogPriceRange === '1500-3000' && (p.priceBDT < 1500 || p.priceBDT > 3000)) {
          return false;
        }
        if (catalogPriceRange === 'above-3000' && p.priceBDT <= 3000) {
          return false;
        }

        // 4. Real-time Search Query Filter across multiple attributes
        if (query) {
          const matchName = p.name.toLowerCase().includes(query);
          const matchSku = p.sku.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchCategory = p.categoryLabel.toLowerCase().includes(query);
          const matchBadge = p.badge?.toLowerCase().includes(query) ?? false;
          const matchSpecs =
            p.specs?.some(
              (s) =>
                s.label.toLowerCase().includes(query) ||
                s.value.toLowerCase().includes(query)
            ) ?? false;
          const matchColors =
            p.colors?.some((c) => c.name.toLowerCase().includes(query)) ?? false;

          return (
            matchName ||
            matchSku ||
            matchDesc ||
            matchCategory ||
            matchBadge ||
            matchSpecs ||
            matchColors
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (catalogSortBy === 'price-asc') return a.priceBDT - b.priceBDT;
        if (catalogSortBy === 'price-desc') return b.priceBDT - a.priceBDT;
        if (catalogSortBy === 'popularity' || catalogSortBy === 'inquiries') {
          const popA = (a.inquiriesCount || 0) * 3 + (a.reviewsCount || 0) * 2 + (a.verifiedCustomersCount || 0);
          const popB = (b.inquiriesCount || 0) * 3 + (b.reviewsCount || 0) * 2 + (b.verifiedCustomersCount || 0);
          return popB - popA;
        }
        if (catalogSortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [
    products,
    catalogCategory,
    catalogSearchQuery,
    catalogInStockOnly,
    catalogPriceRange,
    catalogSortBy,
  ]);

  const hasActiveFilters =
    catalogCategory !== 'all' ||
    catalogSearchQuery.trim() !== '' ||
    catalogInStockOnly ||
    catalogPriceRange !== 'all' ||
    (catalogSortBy !== 'popularity' && catalogSortBy !== 'featured');

  const inStockCount = useMemo(
    () => products.filter((p) => p.inStock).length,
    [products]
  );

  return (
    <section id="catalog-section" className="py-16 bg-[#faf8ff] border-t border-[#eaedff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Heading & Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#006d2f] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-2">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>Curated Product Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
              Trending Products in Bangladesh
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Search live, filter by category or price, and order immediately via WhatsApp without signup.
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              Showing <strong className="text-[#006d2f]">{filteredProducts.length}</strong> of{' '}
              <strong className="text-slate-800">{products.length}</strong> Products
            </span>
          </div>
        </div>

        {/* Real-time Search and Filter Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 mb-6">
          {/* Top Row: Search Input + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Real-Time Live Search Bar */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700 text-[20px]">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                placeholder="Search products by title, SKU, specs, or features... (Press '/' to focus)"
                className="w-full pl-11 pr-24 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 text-sm text-[#131b2e] placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all font-medium"
              />

              {/* Clear button & Shortcut indicator */}
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {catalogSearchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCatalogSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* Sort Selector */}
            <div className="relative min-w-[200px]">
              <select
                value={catalogSortBy}
                onChange={(e) => setCatalogSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="w-full appearance-none bg-white pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
              >
                <option value="popularity">🔥 Popularity (Most Popular)</option>
                <option value="price-asc">💰 Price: Low to High</option>
                <option value="price-desc">💎 Price: High to Low</option>
                <option value="rating">⭐ Customer Rating</option>
                <option value="featured">✨ Featured First</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Quick Keyword Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-amber-500">local_fire_department</span>
              Popular:
            </span>
            {popularKeywords.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setCatalogSearchQuery(tag.label)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  catalogSearchQuery.toLowerCase() === tag.label.toLowerCase()
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              {/* Quick Wishlist pill */}
              <button
                type="button"
                onClick={openWishlist}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                title="View your saved items"
              >
                <span className={`material-symbols-outlined text-[14px] ${wishlistProductIds.length > 0 ? 'text-rose-500 fill' : 'text-slate-400'}`}>
                  favorite
                </span>
                <span>Wishlist ({wishlistProductIds.length})</span>
              </button>

              {/* Quick in-stock pill */}
              <button
                type="button"
                onClick={() => setCatalogInStockOnly(!catalogInStockOnly)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  catalogInStockOnly
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    catalogInStockOnly ? 'bg-emerald-200' : 'bg-emerald-500'
                  }`}
                />
                <span>In-Stock Only ({inStockCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs (Primary Filter) */}
        <div className="mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryDefs.map((cat) => {
              const isSelected = catalogCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCatalogCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'bg-[#006d2f] text-white shadow-md shadow-emerald-900/10 scale-[1.02]'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[16px] ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter Bar: Price Filter & Active Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60 text-xs">
          {/* Price Range Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-slate-600 mr-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-slate-400">payments</span>
              Price:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'under-1500', label: 'Under ৳1,500' },
              { id: '1500-3000', label: '৳1,500 - ৳3,000' },
              { id: 'above-3000', label: '৳3,000+' },
            ].map((range) => (
              <button
                key={range.id}
                type="button"
                onClick={() => setCatalogPriceRange(range.id as any)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  catalogPriceRange === range.id
                    ? 'bg-slate-800 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Active Filter Indicators & Reset Button */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Filters active</span>
              <button
                type="button"
                onClick={resetCatalogFilters}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Dedicated Product List Toolbar with Sorting Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-white p-3.5 sm:px-5 sm:py-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006d2f] animate-pulse"></span>
            <span className="text-xs sm:text-sm font-extrabold text-[#131b2e]">
              {filteredProducts.length === 1 ? '1 Product Available' : `${filteredProducts.length} Products Available`}
            </span>
            {catalogCategory !== 'all' && (
              <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
                {categoryCounts[catalogCategory] ? categoryDefs.find((c) => c.id === catalogCategory)?.label : catalogCategory}
              </span>
            )}
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              Sorted by:{' '}
              <span className="font-bold text-[#006d2f]">
                {catalogSortBy === 'price-asc'
                  ? 'Price: Low to High'
                  : catalogSortBy === 'price-desc'
                  ? 'Price: High to Low'
                  : catalogSortBy === 'popularity'
                  ? 'Popularity'
                  : catalogSortBy === 'rating'
                  ? 'Customer Rating'
                  : 'Featured'}
              </span>
            </span>
          </div>

          {/* Sort By Dropdown Control */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <label
              htmlFor="product-list-sort-select"
              className="text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006d2f]">
                swap_vert
              </span>
              <span>Sort By:</span>
            </label>
            <div className="relative min-w-[210px] flex-1 sm:flex-initial">
              <select
                id="product-list-sort-select"
                value={catalogSortBy}
                onChange={(e) => setCatalogSortBy(e.target.value as any)}
                aria-label="Sort product list by price or popularity"
                className="w-full appearance-none bg-slate-50 hover:bg-white pl-3.5 pr-8 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 shadow-2xs hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 cursor-pointer transition-all"
              >
                <option value="popularity">🔥 Popularity (Most Popular)</option>
                <option value="price-asc">💰 Price: Low to High</option>
                <option value="price-desc">💎 Price: High to Low</option>
                <option value="rating">⭐ Customer Rating</option>
                <option value="featured">✨ Featured Products</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Empty State when no items match filters */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">search_off</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">No products match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              {catalogSearchQuery
                ? `No items found matching "${catalogSearchQuery}". Try checking for typos or searching with broader keywords.`
                : 'No products found matching the selected category and price criteria.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={resetCatalogFilters}
                className="px-4 py-2 bg-[#006d2f] hover:bg-[#005523] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>View All Products</span>
              </button>

              {catalogCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setCatalogCategory('all')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Search in All Categories
                </button>
              )}

              {catalogInStockOnly && (
                <button
                  type="button"
                  onClick={() => setCatalogInStockOnly(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Include Out-of-Stock Items
                </button>
              )}
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const discount =
              product.originalPriceBDT && product.originalPriceBDT > product.priceBDT
                ? product.originalPriceBDT - product.priceBDT
                : 0;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#eaedff] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div
                    onClick={() => navigateToProduct(product.id)}
                    className="relative w-full aspect-square bg-[#f8f9fc] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Stock & Discount Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      {product.inStock && product.stockQuantity > 0 ? (
                        product.stockQuantity <= 5 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/95 text-white text-[11px] font-bold shadow-sm backdrop-blur-sm animate-pulse">
                            Only {product.stockQuantity} Left!
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold shadow-sm backdrop-blur-sm">
                            In Stock ({product.stockQuantity})
                          </span>
                        )
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white text-[11px] font-bold shadow-sm backdrop-blur-sm">
                          Out of Stock
                        </span>
                      )}

                      {discount > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold shadow-sm">
                          Save ৳{discount.toLocaleString()}
                        </span>
                      )}

                      {product.badge && discount === 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#131b2e]/80 text-white text-[10px] font-semibold backdrop-blur-sm">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs z-10 active:scale-90 ${
                        isInWishlist(product.id)
                          ? 'bg-white text-rose-500 shadow-rose-100 hover:bg-rose-50'
                          : 'bg-white/85 hover:bg-white text-slate-500 hover:text-rose-500 backdrop-blur-xs'
                      }`}
                      title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                      aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <span
                        className={`material-symbols-outlined text-[19px] transition-transform ${
                          isInWishlist(product.id) ? 'fill scale-110' : ''
                        }`}
                      >
                        {isInWishlist(product.id) ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>

                    {/* Category Label Overlay */}
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/90 text-slate-700 text-[10px] font-semibold backdrop-blur-xs shadow-2xs border border-white/60">
                        {product.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 pb-0">
                    {/* SKU & Star Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
                      <span>
                        <HighlightText text={product.sku} query={catalogSearchQuery} />
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToProduct(product.id, 'reviews');
                        }}
                        className="flex items-center gap-1 text-amber-600 font-sans font-semibold hover:text-amber-700 transition-colors cursor-pointer group"
                        title="Click to view ratings and customer reviews"
                      >
                        <span className="material-symbols-outlined text-[15px] fill text-amber-500">
                          star
                        </span>
                        <span>{product.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal group-hover:underline">
                          ({product.reviewsCount} reviews)
                        </span>
                      </button>
                    </div>

                    {/* Title with Match Highlight */}
                    <h3
                      onClick={() => navigateToProduct(product.id)}
                      className="font-bold text-base text-[#131b2e] hover:text-[#006d2f] transition-colors cursor-pointer line-clamp-1 mb-1.5"
                    >
                      <HighlightText text={product.name} query={catalogSearchQuery} />
                    </h3>

                    {/* Description Snippet */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      <HighlightText text={product.description} query={catalogSearchQuery} />
                    </p>

                    {/* Price in BDT */}
                    <div className="flex items-baseline gap-2 mb-4 font-mono">
                      <span className="text-2xl font-bold text-[#131b2e]">
                        ৳{product.priceBDT.toLocaleString()}
                      </span>
                      {product.originalPriceBDT && product.originalPriceBDT > product.priceBDT && (
                        <span className="text-sm text-slate-400 line-through">
                          ৳{product.originalPriceBDT.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions (Bottom Contiguous) */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    type="button"
                    onClick={() => openWhatsAppOrder(product, product.colors?.[0]?.name)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-bold text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px]">chat</span>
                    <span>Order on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateToProduct(product.id)}
                    className="w-full py-1 text-center text-xs font-semibold text-slate-500 hover:text-[#006d2f] transition-colors cursor-pointer"
                  >
                    View Specifications &rsaquo;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
