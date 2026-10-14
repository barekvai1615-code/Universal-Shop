import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface ProductReviewsSectionProps {
  product: Product;
  defaultFormOpen?: boolean;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  defaultFormOpen = false,
}) => {
  const { reviews, addReview, toggleReviewHelpful, currentCustomer, openCustomerLogin } = useStore();

  const [isFormOpen, setIsFormOpen] = useState(defaultFormOpen);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');

  // Review Form States
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState(currentCustomer?.name || '');
  const [location, setLocation] = useState(
    currentCustomer
      ? `${currentCustomer.district === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'}, Bangladesh`
      : 'Dhaka, Bangladesh'
  );
  const [comment, setComment] = useState('');
  const [verifiedPurchase, setVerifiedPurchase] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const quickReviewTags = [
    '⚡ Instant WhatsApp Response',
    '📦 Secure Sealed Packaging',
    '💯 100% Original Brand',
    '🚚 Fast Delivery',
    '💵 Seamless Cash on Delivery',
  ];

  // Reviews for this product
  const productReviews = useMemo(() => {
    return reviews.filter((r) => r.productId === product.id);
  }, [reviews, product.id]);

  // Aggregate ratings calculations
  const totalCount = productReviews.length;
  const averageRating = useMemo(() => {
    if (totalCount === 0) return product.rating || 5.0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / totalCount) * 10) / 10;
  }, [productReviews, totalCount, product.rating]);

  // Star breakdown
  const starBreakdown = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [productReviews]);

  // Filtered & Sorted reviews
  const displayReviews = useMemo(() => {
    let result = [...productReviews];

    if (selectedRatingFilter !== 'all') {
      result = result.filter((r) => Math.round(r.rating) === selectedRatingFilter);
    }

    switch (sortBy) {
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        result.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
        break;
      case 'newest':
      default:
        // Recent reviews first (by id or order)
        break;
    }

    return result;
  }, [productReviews, selectedRatingFilter, sortBy]);

  const ratingLabels: Record<number, string> = {
    1: '1 Star - Disappointed with product',
    2: '2 Stars - Below expectations',
    3: '3 Stars - Average / Acceptable',
    4: '4 Stars - Good & Recommended',
    5: '5 Stars - Outstanding & Genuine Quality!',
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!comment.trim() && selectedTags.length === 0) {
      setFormError('Please write a short review or select experience tags.');
      return;
    }

    setFormError('');

    let finalComment = comment.trim();
    if (selectedTags.length > 0) {
      const tagsString = selectedTags.join(' • ');
      finalComment = finalComment
        ? `${finalComment}\n\n[Highlights: ${tagsString}]`
        : `Verified Experience: ${tagsString}`;
    }

    addReview({
      productId: product.id,
      authorName: authorName.trim(),
      location: location.trim() || 'Dhaka',
      rating: formRating,
      comment: finalComment,
      verifiedPurchase,
    });

    // Reset form
    setAuthorName('');
    setComment('');
    setSelectedTags([]);
    setIsFormOpen(false);
  };

  return (
    <div id="reviews-container" className="bg-white rounded-2xl border border-[#eaedff] p-6 sm:p-8 shadow-sm">
      {/* Top Header & Aggregate Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#eaedff] items-center">
        {/* Left Column: Big Average Score */}
        <div className="md:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold mb-3 shadow-xs">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
            <span>Verified Customer Reviews</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-[#131b2e] font-mono tracking-tight">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-slate-400 font-mono text-lg font-bold">/ 5.0</span>
          </div>

          {/* Star display */}
          <div className="flex items-center gap-1 text-amber-500 my-2.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`material-symbols-outlined text-[22px] ${
                  s <= Math.round(averageRating) ? 'fill text-amber-500' : 'text-slate-200'
                }`}
              >
                star
              </span>
            ))}
            <span className="text-xs font-bold text-slate-700 ml-1.5 font-sans">
              ({totalCount} {totalCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Genuine ratings from verified customers across Bangladesh who received this product via WhatsApp order dispatch.
          </p>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#006d2f] hover:bg-[#005523] text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isFormOpen ? 'close' : 'rate_review'}
            </span>
            <span>{isFormOpen ? 'Cancel & Close Form' : '+ Write a Customer Review'}</span>
          </button>
        </div>

        {/* Right Column: Star Rating Distribution Bars */}
        <div className="md:col-span-7 flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>Rating Distribution</span>
            {selectedRatingFilter !== 'all' && (
              <button
                onClick={() => setSelectedRatingFilter('all')}
                className="text-[11px] text-[#006d2f] hover:underline font-semibold cursor-pointer"
              >
                Clear filter (Showing {selectedRatingFilter}★)
              </button>
            )}
          </div>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = starBreakdown[star] || 0;
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            const isSelected = selectedRatingFilter === star;

            return (
              <button
                key={star}
                onClick={() =>
                  setSelectedRatingFilter(isSelected ? 'all' : star)
                }
                title={`Filter by ${star} stars (${count} reviews)`}
                className={`flex items-center gap-3 text-xs w-full p-2 rounded-xl transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 font-bold ring-2 ring-[#25d366] shadow-xs'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1 w-16 shrink-0 font-medium">
                  <span className="font-bold">{star}</span>
                  <span className="material-symbols-outlined text-[15px] fill text-amber-500">
                    star
                  </span>
                </div>

                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSelected ? 'bg-[#006d2f]' : 'bg-[#25d366]'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="w-14 text-right font-mono text-[11px] text-slate-500">
                  {count} <span className="text-slate-400">({pct}%)</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form Drawer / Card */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="my-8 p-6 rounded-2xl bg-[#f4fbf6] border-2 border-[#25d366]/40 shadow-sm animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[20px]">
                  edit_note
                </span>
                <h3 className="font-bold text-base text-[#131b2e]">
                  Write a Review for {product.name}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Your rating and review will be saved in local storage and published immediately to the storefront.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {currentCustomer ? (
            <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006d2f]">verified</span>
                <span>Writing review as logged-in customer: <strong>{currentCustomer.name}</strong></span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                Verified Customer
              </span>
            </div>
          ) : (
            <div className="mb-4 p-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-center justify-between">
              <span>Have an account? Log in to verify your purchase:</span>
              <button
                type="button"
                onClick={() => openCustomerLogin('login')}
                className="font-bold text-[#006d2f] hover:underline cursor-pointer"
              >
                Customer Login
              </button>
            </div>
          )}

          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Interactive Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Your Star Rating <span className="text-rose-600">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setFormRating(star)}
                      className="p-1 transition-transform hover:scale-120 cursor-pointer"
                      title={`${star} Star`}
                    >
                      <span
                        className={`material-symbols-outlined text-[28px] ${
                          (hoverRating || formRating) >= star
                            ? 'fill text-amber-500'
                            : 'text-slate-200 hover:text-amber-300'
                        }`}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#006d2f] px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200/60">
                  {ratingLabels[hoverRating || formRating]}
                </span>
              </div>
            </div>

            {/* Author Name and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Your Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#131b2e] focus:ring-2 focus:ring-[#25d366] focus:border-transparent focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  City / District <span className="text-slate-400 font-normal">(e.g. Mirpur, Dhaka)</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#131b2e] focus:ring-2 focus:ring-[#25d366] focus:border-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Experience Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Quick Highlights <span className="text-slate-400 font-normal">(Click to tag)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {quickReviewTags.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-[#006d2f] text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  Your Detailed Review <span className="text-rose-600">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {comment.length} characters
                </span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on build quality, battery life, sound, delivery via Pathao/Steadfast, and customer chat support on WhatsApp..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#131b2e] focus:ring-2 focus:ring-[#25d366] focus:border-transparent focus:outline-none resize-none"
                required={selectedTags.length === 0}
              />
            </div>

            {/* Verified buyer toggle */}
            <div className="flex items-center gap-2 pt-1 bg-white/70 p-3 rounded-xl border border-slate-200/60">
              <input
                type="checkbox"
                id="verifiedCheck"
                checked={verifiedPurchase}
                onChange={(e) => setVerifiedPurchase(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="verifiedCheck" className="text-xs text-slate-700 font-semibold cursor-pointer">
                I ordered this product via WhatsApp from DokanChat / Universal Shop
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Submit &amp; Publish Review</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 pb-4">
        {/* Star Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedRatingFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              selectedRatingFilter === 'all'
                ? 'bg-[#006d2f] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({totalCount})
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedRatingFilter(s)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                selectedRatingFilter === s
                  ? 'bg-[#006d2f] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{s}★</span>
              <span className="text-[10px] opacity-80 font-mono">({starBreakdown[s] || 0})</span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#006d2f] cursor-pointer"
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 pt-2">
        {displayReviews.length === 0 ? (
          <div className="text-center py-12 bg-[#faf8ff] rounded-2xl border border-dashed border-slate-200 p-6">
            <span className="material-symbols-outlined text-[44px] text-slate-400 mb-2">
              reviews
            </span>
            <p className="text-sm font-bold text-slate-800">
              {selectedRatingFilter === 'all'
                ? 'No customer reviews yet'
                : `No ${selectedRatingFilter}-star reviews found`}
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto">
              Be the first to share your honest feedback after ordering via WhatsApp!
            </p>
            <button
              onClick={() => {
                setSelectedRatingFilter('all');
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-[#006d2f] text-white rounded-xl text-xs font-bold hover:bg-[#005523] transition-colors cursor-pointer"
            >
              Write the First Review
            </button>
          </div>
        ) : (
          displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-[#faf8ff] border border-slate-100 hover:border-emerald-200/80 transition-all space-y-2.5"
            >
              {/* Reviewer Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#006d2f] to-[#25d366] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {rev.authorName ? rev.authorName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#131b2e]">{rev.authorName}</span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                          <span className="material-symbols-outlined text-[12px] text-emerald-600">
                            verified
                          </span>
                          <span>Verified WhatsApp Buyer</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-slate-400">
                        location_on
                      </span>
                      <span>{rev.location}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`material-symbols-outlined text-[16px] ${
                          s <= rev.rating ? 'fill text-amber-500' : 'text-slate-200'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{rev.timestamp}</span>
                </div>
              </div>

              {/* Review Comment Text */}
              <p className="text-xs text-slate-700 leading-relaxed pt-1 whitespace-pre-line">
                "{rev.comment}"
              </p>

              {/* Helpful footer */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600">chat</span>
                  <span>Direct WhatsApp Order Feedback</span>
                </span>
                <button
                  type="button"
                  onClick={() => toggleReviewHelpful(rev.id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-emerald-700">
                    thumb_up
                  </span>
                  <span className="font-semibold">Helpful ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
