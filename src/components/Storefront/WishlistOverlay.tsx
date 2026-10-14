import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

export const WishlistOverlay: React.FC = () => {
  const {
    isWishlistOpen,
    closeWishlist,
    wishlistProducts,
    toggleWishlist,
    clearWishlist,
    navigateToProduct,
    openWhatsAppOrder,
    shareWishlistOnWhatsApp,
    setViewMode,
  } = useStore();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isWishlistOpen) {
        closeWishlist();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWishlistOpen, closeWishlist]);

  // Prevent background body scroll when overlay is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  const totalBDT = wishlistProducts.reduce((sum, p) => sum + p.priceBDT, 0);
  const inStockWishlistCount = wishlistProducts.filter((p) => p.inStock).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={closeWishlist}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <span className="material-symbols-outlined text-[20px] fill">favorite</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  Your Wishlist
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  {wishlistProducts.length}{' '}
                  {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                  {wishlistProducts.length > 0 && ` (${inStockWishlistCount} in stock)`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {wishlistProducts.length > 0 && (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove all items from wishlist"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={closeWishlist}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                title="Close Wishlist"
                aria-label="Close Wishlist"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {wishlistProducts.length === 0 ? (
              /* Empty State */
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[32px]">favorite_border</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
                  Heart items in the catalog to save them here for quick access, or send your wishlist to order on WhatsApp anytime.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeWishlist();
                    setViewMode('storefront');
                    setTimeout(() => {
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#006d2f] hover:bg-[#005523] text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                  <span>Explore Products</span>
                </button>
              </div>
            ) : (
              /* Wishlist Items List */
              <div className="space-y-4">
                {wishlistProducts.map((product) => {
                  const discount =
                    product.originalPriceBDT && product.originalPriceBDT > product.priceBDT
                      ? product.originalPriceBDT - product.priceBDT
                      : 0;

                  return (
                    <div
                      key={product.id}
                      className="group flex gap-3.5 pt-3 first:pt-0 pb-3 bg-white rounded-xl hover:bg-slate-50/60 transition-colors p-2 -mx-2"
                    >
                      {/* Product Thumbnail */}
                      <div
                        onClick={() => {
                          closeWishlist();
                          navigateToProduct(product.id);
                        }}
                        className="relative w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 cursor-pointer border border-slate-200/80"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Category & Stock row */}
                          <div className="flex items-center justify-between gap-1 text-[11px] mb-0.5">
                            <span className="text-slate-500 truncate">{product.categoryLabel}</span>
                            {product.inStock ? (
                              <span className="font-semibold text-emerald-700 flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                In Stock
                              </span>
                            ) : (
                              <span className="font-semibold text-rose-600 flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                Out of Stock
                              </span>
                            )}
                          </div>

                          {/* Product Title */}
                          <h4
                            onClick={() => {
                              closeWishlist();
                              navigateToProduct(product.id);
                            }}
                            className="font-bold text-xs text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1 leading-snug"
                            title={product.name}
                          >
                            {product.name}
                          </h4>

                          {/* Price */}
                          <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                            <span className="font-bold text-sm text-slate-900">
                              ৳{product.priceBDT.toLocaleString()}
                            </span>
                            {discount > 0 && product.originalPriceBDT && (
                              <span className="text-[11px] text-slate-400 line-through">
                                ৳{product.originalPriceBDT.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Actions Row */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              closeWishlist();
                              openWhatsAppOrder(product, product.colors?.[0]?.name);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">chat</span>
                            <span>Order on WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove from wishlist"
                            aria-label={`Remove ${product.name} from wishlist`}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer Summary */}
          {wishlistProducts.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/80 space-y-3">
              {/* Total Row */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Estimated Wishlist Value</span>
                  <div className="text-[11px] text-slate-400">Cash on Delivery available</div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xl font-extrabold text-slate-900">
                    ৳{totalBDT.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={shareWishlistOnWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-bold text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px]">chat</span>
                  <span>Order Wishlist via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={closeWishlist}
                  className="w-full py-2 rounded-xl text-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
