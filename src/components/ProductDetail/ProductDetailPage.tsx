import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { StorefrontHeader } from '../Storefront/StorefrontHeader';
import { StorefrontFooter } from '../Storefront/StorefrontFooter';
import { ProductReviewsSection } from './ProductReviewsSection';
import { Product } from '../../types';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    settings,
    navigateToProduct,
    setViewMode,
    openWhatsAppOrder,
    showToast,
    reviews,
    activeProductTab,
    setActiveProductTab,
    setCatalogCategory,
    wishlistProductIds,
    toggleWishlist,
    isInWishlist,
    openWishlist,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors?.[0]?.name || 'Matte Black'
  );
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'how-it-works'>(
    activeProductTab || 'details'
  );

  useEffect(() => {
    if (activeProductTab) {
      setActiveTab(activeProductTab);
    }
  }, [activeProductTab]);

  const productReviews = reviews.filter((r) => r.productId === product?.id);
  const totalReviewsCount = productReviews.length;
  const averageRating = totalReviewsCount > 0
    ? Math.round((productReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount) * 10) / 10
    : product?.rating || 5.0;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#faf8ff]">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-800">Product not found</p>
          <button
            onClick={() => setViewMode('storefront')}
            className="mt-4 px-4 py-2 bg-[#006d2f] text-white rounded-lg text-sm font-semibold"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  const discount =
    product.originalPriceBDT && product.originalPriceBDT > product.priceBDT
      ? product.originalPriceBDT - product.priceBDT
      : 0;

  const discountPct =
    discount > 0 && product.originalPriceBDT
      ? Math.round((discount / product.originalPriceBDT) * 100)
      : 0;

  // Thumbnails
  const thumbs = product.thumbnails && product.thumbnails.length > 0
    ? product.thumbnails
    : [
        { id: '1', label: 'Hero View', url: product.image },
        { id: '2', label: 'Angle View', url: product.image },
        { id: '3', label: 'Feature Detail', url: product.image },
        { id: '4', label: 'In The Box', url: product.image },
      ];

  const currentImageUrl = thumbs[activeThumbIndex]?.url || product.image;

  // Live WhatsApp preview text
  const livePreviewText = `Hello! I am interested in ordering this product.
Product: ${product.name} (${selectedColor})
Price: ৳${product.priceBDT.toLocaleString()}
Product Link: https://dokanchat.com/products/${product.id}
Please let me know about product availability and delivery. Thank you!`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + `#product-${product.id}`);
    showToast('Product link copied to clipboard!');
  };

  // Related products
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e]">
      <StorefrontHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <button
            onClick={() => setViewMode('storefront')}
            className="hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">home</span>
            <span>Home</span>
          </button>
          <span>/</span>
          <button
            onClick={() => setViewMode('storefront')}
            className="hover:text-emerald-700 transition-colors cursor-pointer"
          >
            Products
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => {
              setCatalogCategory(product.category);
              setViewMode('storefront');
            }}
            className="capitalize hover:text-emerald-700 hover:underline transition-colors cursor-pointer font-medium"
          >
            {product.categoryLabel || product.category}
          </button>
          <span>/</span>
          <span className="text-[#131b2e] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 2-Column Product Showcase & Purchase Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-16">
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Main Stage View */}
            <div className="relative w-full aspect-square bg-white rounded-2xl border border-[#eaedff] overflow-hidden shadow-sm flex items-center justify-center p-6">
              {/* Badges in Top Left */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                    product.inStock && product.stockQuantity > 0
                      ? product.stockQuantity <= 5
                        ? 'bg-amber-50 text-amber-900 border border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                      : 'bg-rose-50 text-rose-800 border border-rose-300'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      product.inStock && product.stockQuantity > 0
                        ? product.stockQuantity <= 5
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-emerald-500'
                        : 'bg-rose-600'
                    }`}
                  ></span>
                  <span>
                    {product.inStock && product.stockQuantity > 0
                      ? product.stockQuantity <= 5
                        ? `Low Stock: Only ${product.stockQuantity} Left!`
                        : `In Stock (${product.stockQuantity} Units) • Ready to Dispatch`
                      : 'Out of Stock • Restocking Soon'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 text-[11px] font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[13px] text-teal-600">bolt</span>
                  <span>Same Day Dispatch Dhaka</span>
                </span>
              </div>

              {/* Wishlist Heart Button in Stage */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm z-10 active:scale-95 ${
                  isInWishlist(product.id)
                    ? 'bg-white border-rose-200 text-rose-500 shadow-rose-100 hover:bg-rose-50'
                    : 'bg-white/90 border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-white backdrop-blur-xs'
                }`}
                title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <span className={`material-symbols-outlined text-[22px] ${isInWishlist(product.id) ? 'fill text-rose-500' : ''}`}>
                  {isInWishlist(product.id) ? 'favorite' : 'favorite_border'}
                </span>
              </button>

              {/* Product Photo */}
              <img
                src={currentImageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />

              {/* Bottom Tagline & SKU */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                  <span>100% Genuine Imported Model</span>
                </span>
                <span className="font-mono text-slate-400">{product.sku}</span>
              </div>
            </div>

            {/* Thumbnail Perspective Switcher (Matching Image 3) */}
            <div className="grid grid-cols-4 gap-3">
              {thumbs.map((thumb, idx) => (
                <button
                  key={thumb.id || idx}
                  onClick={() => setActiveThumbIndex(idx)}
                  className={`p-2 rounded-xl bg-white border transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                    activeThumbIndex === idx
                      ? 'border-[#006d2f] ring-2 ring-[#25d366]/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="w-full aspect-square bg-[#f8f9fc] rounded-lg overflow-hidden">
                    <img
                      src={thumb.url}
                      alt={thumb.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 whitespace-nowrap">
                    {thumb.label}
                  </span>
                </button>
              ))}
            </div>

            {/* 3 Quick Assurance Bullets (Matching Image 3) */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white border border-[#eaedff] text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-700">payments</span>
                <span>Cash on Delivery nationwide</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-700">sync</span>
                <span>7 Days easy check replacement</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-700">support_agent</span>
                <span>WhatsApp support 10am-11pm</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Top Product Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                <span>Original Brand Guaranteed</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setCatalogCategory(product.category);
                  setViewMode('storefront');
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded-md border border-slate-200 transition-colors cursor-pointer"
                title="Browse this category in Storefront"
              >
                <span className="material-symbols-outlined text-[13px] text-emerald-600">category</span>
                <span>{product.categoryLabel}</span>
              </button>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60">
                <span>{product.badge || 'Top Seller in Sound & Audio'}</span>
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight leading-snug mb-2">
              {product.name}
            </h1>

            {/* Reviews & Social Proof */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                  setActiveProductTab('reviews');
                  document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center text-amber-500 font-bold hover:opacity-80 transition-opacity cursor-pointer group"
                title="View customer reviews and ratings"
              >
                <div className="flex text-amber-500 mr-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`material-symbols-outlined text-[16px] ${
                        s <= Math.round(averageRating) ? 'fill text-amber-500' : 'text-slate-200'
                      }`}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-slate-800 font-sans font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-slate-500 font-normal ml-1 group-hover:text-emerald-700">
                  ({totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'})
                </span>
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                  setActiveProductTab('reviews');
                  document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                {product.verifiedCustomersCount || 128} verified reviews via WhatsApp
              </button>
              <span>·</span>
              <span className="text-slate-500">340+ Delivered This Month</span>
            </div>

            {/* Pricing Box (Matching Image 3) */}
            <div className="p-4 rounded-xl bg-white border border-[#eaedff] mb-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#131b2e] font-mono">
                  ৳{product.priceBDT.toLocaleString()}
                </span>
                {product.originalPriceBDT && product.originalPriceBDT > product.priceBDT && (
                  <span className="text-lg text-slate-400 line-through font-mono">
                    ৳{product.originalPriceBDT.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-xs font-bold">
                    Save ৳{discount.toLocaleString()} ({discountPct}% OFF)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">payments</span>
                <span>Pay Cash on Delivery or bKash</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Key Specifications (2x2 Grid) */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-700">tune</span>
                <span>Key Specifications</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.specs?.map((spec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-white border border-[#eaedff] flex items-start gap-2.5"
                  >
                    <span className="material-symbols-outlined text-[18px] text-emerald-700 shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <span className="font-bold text-xs text-[#131b2e] block">{spec.label}:</span>
                      <span className="text-xs text-slate-600">{spec.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color / Edition Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Color / Edition:
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        selectedColor === color.name
                          ? 'border-[#006d2f] bg-emerald-50/50 text-[#006d2f] ring-2 ring-[#25d366]/30'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: color.hex }}
                      ></span>
                      <span>{color.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({color.available ? 'Available' : 'Out'})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fast Order via WhatsApp Module (Matching Image 3) */}
            <div className="p-5 rounded-2xl bg-white border-2 border-emerald-300/80 shadow-md mb-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25d366]"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#006d2f]">
                    Fast Order via WhatsApp
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  No Account Needed
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Click below to start an instant WhatsApp conversation with the store owner. Your order details and link will be automatically formatted for you.
              </p>

              {/* Dynamic Live WhatsApp Message Preview Container */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono leading-relaxed mb-4 whitespace-pre-wrap select-all relative group">
                <div className="text-[10px] text-slate-400 font-sans uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Live WhatsApp Message Preview:</span>
                  <span className="text-emerald-700 font-medium">Pre-filled text</span>
                </div>
                {livePreviewText}
              </div>

              {/* Big Green Order Button */}
              <button
                onClick={() => openWhatsAppOrder(product, selectedColor)}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-black text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">chat</span>
                <span>Order on WhatsApp Now &rarr;</span>
              </button>

              {/* Secondary Wishlist Actions */}
              <div className="flex gap-2.5 mt-2.5">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-[0.98] ${
                    isInWishlist(product.id)
                      ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-rose-600'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isInWishlist(product.id) ? 'fill text-rose-500' : ''}`}>
                    {isInWishlist(product.id) ? 'favorite' : 'favorite_border'}
                  </span>
                  <span>{isInWishlist(product.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={openWishlist}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Open Wishlist"
                >
                  <span className="material-symbols-outlined text-[18px] text-rose-500">list_alt</span>
                  <span>Wishlist ({wishlistProductIds.length})</span>
                </button>
              </div>

              <div className="flex items-start gap-1.5 mt-3 text-[11px] text-slate-500">
                <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5">
                  bolt
                </span>
                <span>
                  <strong>Direct Contact with Shop Owner:</strong> No advance registration or credit card needed. Inspect your item at delivery and pay via <strong>Cash on Delivery or bKash / Nagad</strong>.
                </span>
              </div>
            </div>

            {/* Delivery Charges & Speed Card (Matching Image 3) */}
            <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs space-y-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">local_shipping</span>
                <span>Delivery Charges &amp; Speed</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#faf8ff] border border-slate-100">
                  <div className="font-bold text-[#131b2e] flex items-center gap-1 mb-0.5">
                    <span className="material-symbols-outlined text-[15px] text-emerald-700">location_city</span>
                    <span>Dhaka City Delivery</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">24 to 48 Hours maximum</p>
                  <p className="font-bold text-emerald-800 mt-1 font-mono">
                    ৳{settings.dhakaDeliveryCharge} Delivery Charge
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#faf8ff] border border-slate-100">
                  <div className="font-bold text-[#131b2e] flex items-center gap-1 mb-0.5">
                    <span className="material-symbols-outlined text-[15px] text-emerald-700">map</span>
                    <span>Outside Dhaka (All BD)</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">48 to 72 Hours via Courier</p>
                  <p className="font-bold text-emerald-800 mt-1 font-mono">
                    ৳{settings.outsideDeliveryCharge} Delivery Charge
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                <span>7 Days Replacement: If any manufacturing defect is discovered, simply send a photo on WhatsApp for instant swap.</span>
              </div>
            </div>

            {/* Copy Link Bar & Reviews Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono">
                <span className="truncate max-w-[200px] sm:max-w-[280px]">
                  dokanchat.com/products/{product.id}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-sans font-semibold transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>Copy Link</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                  setActiveProductTab('reviews');
                  document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#006d2f] border border-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer hover:border-emerald-500"
              >
                <span className="material-symbols-outlined text-[17px] text-amber-500 fill">star</span>
                <span>Customer Reviews ({totalReviewsCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Information Section (Matching Image 3) */}
        <section id="tabs-section" className="mb-16 scroll-mt-24">
          <div className="border-b border-[#eaedff] flex items-center gap-6 sm:gap-8 mb-6 overflow-x-auto pb-1">
            <button
              onClick={() => {
                setActiveTab('details');
                setActiveProductTab('details');
              }}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'details'
                  ? 'border-[#006d2f] text-[#006d2f]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => {
                setActiveTab('reviews');
                setActiveProductTab('reviews');
              }}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-[#006d2f] text-[#006d2f]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Customer Reviews</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  activeTab === 'reviews'
                    ? 'bg-emerald-100 text-[#006d2f]'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {totalReviewsCount}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('how-it-works');
                setActiveProductTab('how-it-works');
              }}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'how-it-works'
                  ? 'border-[#006d2f] text-[#006d2f]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              How WhatsApp Order Works
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
                </div>
                <h4 className="font-bold text-base text-[#131b2e] mb-1.5">
                  Active Noise Cancellation
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Up to 35dB hybrid ANC filters out bustling city traffic, office chatter, and engine rumble for pure auditory focus.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </div>
                <h4 className="font-bold text-base text-[#131b2e] mb-1.5">
                  Dual ENC Mic Calls
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Intelligent Environmental Noise Cancellation algorithms isolate your voice during windy rides or crowded transport.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[20px]">speed</span>
                </div>
                <h4 className="font-bold text-base text-[#131b2e] mb-1.5">
                  Ultra-Low 45ms Latency
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Specialized Gaming &amp; Video sync mode eliminates audio lag while watching YouTube streams or playing PUBG mobile.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <ProductReviewsSection product={product} />
          )}

          {activeTab === 'how-it-works' && (
            <div className="bg-white rounded-2xl border border-[#eaedff] p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-base text-[#131b2e]">How Ordering on WhatsApp Works</h4>
              <ol className="list-decimal list-inside space-y-3 text-xs text-slate-600 leading-relaxed">
                <li><strong className="text-slate-900">Click 'Order on WhatsApp Now'</strong>: We format the product details, edition, and live link into an instant message.</li>
                <li><strong className="text-slate-900">Send message to our verified shop number</strong>: Our support team confirms stock availability immediately.</li>
                <li><strong className="text-slate-900">Provide Delivery Address</strong>: Share your Thana, District, and phone number for Pathao / Steadfast courier.</li>
                <li><strong className="text-slate-900">Receive &amp; Pay</strong>: Inspect the package when the delivery agent arrives, then pay via Cash or bKash.</li>
              </ol>
            </div>
          )}
        </section>

        {/* Related Products Section (Matching Image 3) */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#131b2e]">Related Audio Products</h3>
              <p className="text-xs text-slate-500">Frequently ordered together with instant WhatsApp dispatch.</p>
            </div>
            <button
              onClick={() => {
                setViewMode('storefront');
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#006d2f] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Browse All Audio</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <div
                key={rel.id}
                className="bg-white rounded-2xl border border-[#eaedff] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => navigateToProduct(rel.id)}
                    className="w-full aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {rel.categoryLabel}
                    </span>
                    <h4
                      onClick={() => navigateToProduct(rel.id)}
                      className="font-bold text-sm text-[#131b2e] hover:text-[#006d2f] transition-colors cursor-pointer mt-1 line-clamp-1"
                    >
                      {rel.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-3">
                      {rel.description}
                    </p>
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="font-bold text-base text-[#131b2e]">
                        ৳{rel.priceBDT.toLocaleString()}
                      </span>
                      {rel.originalPriceBDT && (
                        <span className="text-xs text-slate-400 line-through">
                          ৳{rel.originalPriceBDT.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => openWhatsAppOrder(rel)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#25d366]/20 hover:text-[#006d2f] text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>Order on WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
};
