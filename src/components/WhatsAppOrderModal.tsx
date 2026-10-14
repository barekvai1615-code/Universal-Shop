import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export const WhatsAppOrderModal: React.FC = () => {
  const {
    orderSimulator,
    closeOrderSimulator,
    settings,
    createOrder,
    navigateToTracking,
    generateWhatsAppUrl,
    showToast,
    currentCustomer,
    openCustomerLogin,
  } = useStore();

  const [customerName, setCustomerName] = useState(currentCustomer?.name || 'Tanvir Hossain');
  const [customerPhone, setCustomerPhone] = useState(currentCustomer?.phone || '+880 1812-445566');
  const [district, setDistrict] = useState<'dhaka' | 'outside'>(currentCustomer?.district || 'dhaka');
  const [address, setAddress] = useState(currentCustomer?.address || 'House 42, Road 11, Dhanmondi, Dhaka');
  const [quantity, setQuantity] = useState(1);

  // Sync with currentCustomer when modal opens or customer changes
  useEffect(() => {
    if (currentCustomer) {
      setCustomerName(currentCustomer.name);
      setCustomerPhone(currentCustomer.phone);
      setDistrict(currentCustomer.district);
      setAddress(currentCustomer.address);
    }
  }, [currentCustomer, orderSimulator.isOpen]);

  if (!orderSimulator.isOpen || !orderSimulator.product) {
    return null;
  }

  const { product, selectedColor, customerNote } = orderSimulator;
  const deliveryFee =
    district === 'dhaka'
      ? settings.dhakaDeliveryCharge
      : settings.outsideDeliveryCharge;
  const subtotal = product.priceBDT * quantity;
  const total = subtotal + deliveryFee;

  const handleConfirmAndRecordOrder = () => {
    const created = createOrder({
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      productImage: product.image,
      customerName,
      customerPhone,
      district,
      address,
      colorSelected: selectedColor || 'Standard Edition',
      quantity,
      productPriceBDT: product.priceBDT,
      deliveryChargeBDT: deliveryFee,
      totalAmountBDT: total,
      notes: customerNote,
    });
    closeOrderSimulator();
    navigateToTracking(created.id);
  };

  const handleOpenRealWhatsApp = () => {
    const customNote = `Customer: ${customerName} (${customerPhone})\nAddress: ${address} (${district === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})\nTotal payable: ৳${total.toLocaleString()}`;
    const url = generateWhatsAppUrl(product, selectedColor, customNote);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* WhatsApp Green Top Header */}
        <div className="bg-[#006d2f] text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25d366] text-[#00471c] flex items-center justify-center font-bold text-base shadow-xs">
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm leading-tight">
                  {settings.storeName} WhatsApp Checkout
                </h3>
                <span className="material-symbols-outlined text-[15px] text-[#25d366]">
                  verified
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                Official Business Number: {settings.formattedNumber}
              </p>
            </div>
          </div>

          <button
            onClick={closeOrderSimulator}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs bg-[#faf8ff]">
          {/* Product Summary Mini Card */}
          <div className="p-3.5 bg-white rounded-xl border border-[#eaedff] flex items-center gap-3 shadow-xs">
            <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-xs text-[#131b2e] block truncate">
                {product.name}
              </span>
              <span className="text-[11px] text-slate-500 block">
                Edition: <strong>{selectedColor || 'Standard'}</strong>
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono font-bold text-emerald-800">
                  ৳{product.priceBDT.toLocaleString()}
                </span>
                <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
                  <span className="text-slate-500 text-[10px]">Qty:</span>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="font-bold text-slate-700 hover:text-black px-1"
                  >
                    -
                  </button>
                  <span className="font-bold font-mono text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="font-bold text-slate-700 hover:text-black px-1"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info Form */}
          <div className="bg-white p-4 rounded-xl border border-[#eaedff] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-[#131b2e] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">
                  location_on
                </span>
                <span>Delivery Details (Cash on Delivery)</span>
              </h4>
              {currentCustomer ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]"></span>
                  <span>Customer: {currentCustomer.name.split(' ')[0]}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => openCustomerLogin('login')}
                  className="text-[11px] font-bold text-[#006d2f] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">person</span>
                  <span>Customer Login</span>
                </button>
              )}
            </div>

            {currentCustomer ? (
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#006d2f]">verified_user</span>
                  <span className="text-emerald-900">
                    Saved delivery address applied for <strong>{currentCustomer.name}</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-900">
                  <span className="material-symbols-outlined text-[16px] text-amber-700">info</span>
                  <span>Have an account? Auto-fill your saved address:</span>
                </div>
                <button
                  type="button"
                  onClick={() => openCustomerLogin('login')}
                  className="px-2 py-0.5 rounded bg-white border border-amber-300 font-bold text-amber-900 hover:bg-amber-100 text-[10px] cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#25d366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-[#25d366] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Select Destination District
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDistrict('dhaka')}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    district === 'dhaka'
                      ? 'border-[#006d2f] bg-emerald-50 text-emerald-900 font-bold ring-1 ring-[#25d366]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs">Inside Dhaka City</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    ৳{settings.dhakaDeliveryCharge} · 24-48 Hours
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDistrict('outside')}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    district === 'outside'
                      ? 'border-[#006d2f] bg-emerald-50 text-emerald-900 font-bold ring-1 ring-[#25d366]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs">Outside Dhaka (All BD)</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    ৳{settings.outsideDeliveryCharge} · 48-72 Hours
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Detailed Road &amp; House Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, Thana, District"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#25d366] focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white p-3.5 rounded-xl border border-[#eaedff] space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal ({quantity}x)</span>
              <span className="font-mono font-medium">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charge</span>
              <span className="font-mono font-medium">৳{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-[#131b2e]">
              <span>Cash on Delivery Payable</span>
              <span className="font-mono text-emerald-800 text-base">
                ৳{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleOpenRealWhatsApp}
            className="flex-1 py-3 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>Send to Real WhatsApp</span>
          </button>

          <button
            onClick={handleConfirmAndRecordOrder}
            className="flex-1 py-3 rounded-xl bg-[#006d2f] hover:bg-[#005523] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Record Order in Admin Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
