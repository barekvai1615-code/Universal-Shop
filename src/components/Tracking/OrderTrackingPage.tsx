import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { StorefrontHeader } from '../Storefront/StorefrontHeader';
import { StorefrontFooter } from '../Storefront/StorefrontFooter';
import { OrderInquiry } from '../../types';

export const OrderTrackingPage: React.FC = () => {
  const {
    orders,
    activeTrackingId,
    setActiveTrackingId,
    findOrder,
    settings,
    setViewMode,
    showToast,
    currentCustomer,
    openCustomerLogin,
  } = useStore();

  const [searchInput, setSearchInput] = useState(activeTrackingId || 'ORD-9021');
  const [selectedOrder, setSelectedOrder] = useState<OrderInquiry | undefined>(() => {
    return (
      (activeTrackingId && orders.find((o) => o.id === activeTrackingId)) ||
      orders[0]
    );
  });
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (activeTrackingId) {
      const match = orders.find((o) => o.id === activeTrackingId);
      if (match) {
        setSelectedOrder(match);
        setSearchInput(match.id);
        setNotFound(false);
      }
    }
  }, [activeTrackingId, orders]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    const found = findOrder(searchInput);
    if (found) {
      setSelectedOrder(found);
      setActiveTrackingId(found.id);
      setNotFound(false);
      showToast(`Tracking details found for ${found.id}!`);
    } else {
      setNotFound(true);
      showToast('No order found with that ID or Phone number', 'error');
    }
  };

  const handleQuickSelect = (id: string) => {
    setSearchInput(id);
    const match = orders.find((o) => o.id === id);
    if (match) {
      setSelectedOrder(match);
      setActiveTrackingId(match.id);
      setNotFound(false);
    }
  };

  const handleCopyConsignment = (consignmentId?: string) => {
    if (!consignmentId) return;
    navigator.clipboard?.writeText(consignmentId);
    showToast(`Consignment ${consignmentId} copied to clipboard!`);
  };

  const handleWhatsAppHelp = (order: OrderInquiry) => {
    const text = `Hello! I have a question regarding my order *${order.id}* (${order.productName}).\nConsignment ID: ${order.consignmentId || 'Pending'}\nCustomer Phone: ${order.customerPhone}`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Step indices
  const getStepProgress = (status: OrderInquiry['status']) => {
    switch (status) {
      case 'new':
        return 1;
      case 'confirmed':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = selectedOrder ? getStepProgress(selectedOrder.status) : 1;

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col justify-between">
      <StorefrontHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <button
            onClick={() => setViewMode('storefront')}
            className="hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">home</span>
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-[#131b2e] font-semibold">Live Order Tracking</span>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold mb-3 shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">local_shipping</span>
            <span>Real-Time Courier &amp; WhatsApp Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight mb-2">
            Track Your Order Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Check the live fulfillment and courier consignment dispatch status for your WhatsApp order across Bangladesh.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-2xl border border-[#eaedff] p-5 sm:p-6 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. ORD-9021) or WhatsApp Phone..."
                className="w-full pl-11 pr-4 py-3 bg-[#faf8ff] border border-slate-200 rounded-xl text-xs sm:text-sm text-[#131b2e] font-mono focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#006d2f] hover:bg-[#005523] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              <span>Track Order</span>
            </button>
          </form>

          {/* Customer Orders or Login prompt */}
          {currentCustomer ? (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#006d2f]">person</span>
                  <span>Orders for {currentCustomer.name}:</span>
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold">1-Click to track your orders</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {orders
                  .filter((o) => {
                    const cleanCust = currentCustomer.phone.replace(/\D/g, '');
                    const cleanOrd = o.customerPhone.replace(/\D/g, '');
                    return (cleanCust.length >= 8 && cleanOrd.includes(cleanCust)) || o.customerName.toLowerCase() === currentCustomer.name.toLowerCase();
                  })
                  .map((ord) => (
                    <button
                      key={ord.id}
                      type="button"
                      onClick={() => handleQuickSelect(ord.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        selectedOrder?.id === ord.id
                          ? 'bg-[#006d2f] text-white border-[#006d2f] shadow-xs'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      <span>{ord.id}</span>
                      <span className="text-[10px] uppercase font-sans font-semibold opacity-90">({ord.status})</span>
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">account_circle</span>
                <span>Track all your past orders automatically:</span>
              </span>
              <button
                type="button"
                onClick={() => openCustomerLogin('login')}
                className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#006d2f] font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
              >
                Customer Sign In
              </button>
            </div>
          )}

          {/* Quick Demo Helpers */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Quick Test Orders:</span>
            {orders.slice(0, 3).map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => handleQuickSelect(ord.id)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  selectedOrder?.id === ord.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {ord.id} ({ord.status.toUpperCase()})
              </button>
            ))}
          </div>
        </div>

        {/* Not Found State */}
        {notFound && (
          <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-sm mb-8">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[26px]">search_off</span>
            </div>
            <h3 className="font-bold text-base text-rose-950 mb-1">
              No matching order was found
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
              Please double check the Order ID (like <code className="font-mono font-bold">ORD-9021</code>) or phone number you used when initiating order via WhatsApp.
            </p>
            <button
              onClick={() => handleQuickSelect('ORD-9021')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Load Sample Order #ORD-9021
            </button>
          </div>
        )}

        {/* Live Order Tracking Card */}
        {selectedOrder && !notFound && (
          <div className="bg-white rounded-2xl border border-[#eaedff] shadow-md overflow-hidden mb-8">
            {/* Top Order Summary Banner */}
            <div className="p-6 bg-gradient-to-r from-[#006d2f] to-[#005523] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-base sm:text-lg">
                    {selectedOrder.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-emerald-400 text-emerald-950'
                        : selectedOrder.status === 'shipped'
                        ? 'bg-purple-300 text-purple-950'
                        : selectedOrder.status === 'confirmed'
                        ? 'bg-blue-300 text-blue-950'
                        : 'bg-amber-300 text-amber-950'
                    }`}
                  >
                    {selectedOrder.status === 'new'
                      ? 'Inquiry Placed'
                      : selectedOrder.status === 'confirmed'
                      ? 'Confirmed'
                      : selectedOrder.status === 'shipped'
                      ? 'In Transit'
                      : 'Delivered'}
                  </span>
                </div>
                <p className="text-xs text-emerald-100 font-sans">
                  Ordered on {selectedOrder.timestamp} via WhatsApp
                </p>
              </div>

              {/* Courier & Delivery ETA Pill */}
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 text-right">
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
                  Estimated Delivery
                </span>
                <span className="text-sm font-bold text-white block">
                  {selectedOrder.estimatedDeliveryDate || 'Within 24-48 Hours'}
                </span>
              </div>
            </div>

            {/* Consignment & Courier Details Strip */}
            <div className="p-4 bg-[#f2f3ff] border-b border-[#eaedff] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006d2f]">
                  local_shipping
                </span>
                <span className="text-slate-600">Courier Partner:</span>
                <strong className="text-[#131b2e]">
                  {selectedOrder.courierPartner || 'Pathao Express / Steadfast'}
                </strong>
              </div>

              {selectedOrder.consignmentId && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">Consignment ID:</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {selectedOrder.consignmentId}
                  </span>
                  <button
                    onClick={() => handleCopyConsignment(selectedOrder.consignmentId)}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Copy Consignment ID"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4-Step Interactive Visual Timeline */}
            <div className="p-6 border-b border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                      currentStep >= 1
                        ? 'bg-[#25d366] text-[#00471c] shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </div>
                  <span className="font-bold text-xs text-[#131b2e]">1. WhatsApp Order</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Inquiry Placed</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                      currentStep >= 2
                        ? 'bg-[#25d366] text-[#00471c] shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <span className="font-bold text-xs text-[#131b2e]">2. Verified</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">QC &amp; Invoice</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                      currentStep >= 3
                        ? 'bg-[#25d366] text-[#00471c] shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  </div>
                  <span className="font-bold text-xs text-[#131b2e]">3. In Transit</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Courier Hub</span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                      currentStep >= 4
                        ? 'bg-[#25d366] text-[#00471c] shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  </div>
                  <span className="font-bold text-xs text-[#131b2e]">4. Delivered</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Tracking Milestones List & Product Summary (2-Col) */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Tracking Log */}
              <div className="md:col-span-7">
                <h3 className="font-bold text-sm text-[#131b2e] mb-4 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006d2f]">
                    timeline
                  </span>
                  <span>Consignment Dispatch History</span>
                </h3>

                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedOrder.trackingEvents?.map((evt, idx) => (
                    <div key={idx} className="relative">
                      {/* Status Dot */}
                      <span
                        className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                          evt.completed
                            ? 'bg-[#006d2f] text-white'
                            : 'bg-slate-300 text-transparent'
                        }`}
                      >
                        {evt.completed && (
                          <span className="material-symbols-outlined text-[10px]">check</span>
                        )}
                      </span>

                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-[#131b2e]">{evt.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {evt.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-slate-400">
                            location_on
                          </span>
                          <span>{evt.location}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Order Items & Delivery Address Card */}
              <div className="md:col-span-5 bg-[#faf8ff] p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Item Purchased
                  </h4>
                  <div className="flex items-center gap-3 mb-4 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={selectedOrder.productImage}
                        alt={selectedOrder.productName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-[#131b2e] truncate">
                        {selectedOrder.productName}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {selectedOrder.productSku} · Qty: {selectedOrder.quantity}
                      </p>
                      <p className="text-[11px] text-[#006d2f] font-semibold">
                        Edition: {selectedOrder.colorSelected || 'Standard'}
                      </p>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Delivery Address
                  </h4>
                  <div className="text-xs text-slate-700 space-y-1 mb-4 bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-900">{selectedOrder.customerName}</p>
                    <p className="font-mono text-slate-600">{selectedOrder.customerPhone}</p>
                    <p className="text-slate-500 text-[11px]">{selectedOrder.address}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                      {selectedOrder.district === 'dhaka' ? 'Inside Dhaka (৳60)' : 'Outside Dhaka (৳120)'}
                    </span>
                  </div>
                </div>

                {/* Total Cash on Delivery */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Cash on Delivery Payable:</span>
                  <span className="text-base font-extrabold text-[#006d2f] font-mono">
                    ৳{selectedOrder.totalAmountBDT.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer with Direct WhatsApp Help Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Have questions or need to reschedule delivery with courier?
              </span>
              <button
                onClick={() => handleWhatsAppHelp(selectedOrder)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Chat with Shop Manager about this Order</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <StorefrontFooter />
    </div>
  );
};
