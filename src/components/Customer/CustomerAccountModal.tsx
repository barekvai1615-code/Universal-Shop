import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const CustomerAccountModal: React.FC = () => {
  const {
    currentCustomer,
    isCustomerAccountModalOpen,
    closeCustomerAccount,
    logoutCustomer,
    orders,
    navigateToTracking,
    updateCustomerProfile,
    customers,
    quickSwitchCustomer,
    openCustomerLogin,
    wishlistProductIds,
    openWishlist,
  } = useStore();

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(currentCustomer?.address || '');
  const [districtInput, setDistrictInput] = useState<'dhaka' | 'outside'>(currentCustomer?.district || 'dhaka');

  if (!isCustomerAccountModalOpen || !currentCustomer) return null;

  // Filter orders placed by this customer (by matching phone digits or customer name)
  const customerPhoneClean = currentCustomer.phone.replace(/\D/g, '');
  const customerOrders = orders.filter((o) => {
    const oPhoneClean = o.customerPhone.replace(/\D/g, '');
    const phoneMatch = oPhoneClean.length >= 8 && (oPhoneClean.includes(customerPhoneClean) || customerPhoneClean.includes(oPhoneClean));
    const nameMatch = o.customerName.toLowerCase() === currentCustomer.name.toLowerCase();
    return phoneMatch || nameMatch;
  });

  const handleSaveAddress = () => {
    updateCustomerProfile({
      address: addressInput,
      district: districtInput,
    });
    setIsEditingAddress(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">New Inquiry</span>;
      case 'confirmed':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Confirmed</span>;
      case 'shipped':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">In Transit</span>;
      case 'delivered':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Delivered</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006d2f] to-[#00471c] text-white p-5 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-300 shadow-xs shrink-0">
              <img
                src={currentCustomer.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${currentCustomer.name}`}
                alt={currentCustomer.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base leading-tight">{currentCustomer.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-100 text-[10px] font-bold">
                  Verified Customer
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5 flex items-center gap-2">
                <span>{currentCustomer.phone}</span>
                {currentCustomer.email && (
                  <>
                    <span>•</span>
                    <span>{currentCustomer.email}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={closeCustomerAccount}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#faf8ff] text-xs text-[#131b2e]">
          {/* Saved Address Section */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#006d2f]">home_pin</span>
                Saved Delivery Address
              </span>
              <button
                type="button"
                onClick={() => {
                  if (isEditingAddress) {
                    handleSaveAddress();
                  } else {
                    setAddressInput(currentCustomer.address);
                    setDistrictInput(currentCustomer.district);
                    setIsEditingAddress(true);
                  }
                }}
                className="text-xs font-bold text-[#006d2f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isEditingAddress ? 'check' : 'edit'}
                </span>
                <span>{isEditingAddress ? 'Save Address' : 'Edit'}</span>
              </button>
            </div>

            {isEditingAddress ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDistrictInput('dhaka')}
                    className={`p-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                      districtInput === 'dhaka'
                        ? 'border-[#006d2f] bg-emerald-50 text-[#006d2f]'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Inside Dhaka (৳60)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistrictInput('outside')}
                    className={`p-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                      districtInput === 'outside'
                        ? 'border-[#006d2f] bg-emerald-50 text-[#006d2f]'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Outside Dhaka (৳120)
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006d2f] outline-none resize-none"
                  placeholder="Detailed address"
                />
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800 text-xs">{currentCustomer.address}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Region: <strong className="text-emerald-800">{currentCustomer.district === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</strong>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  Default Checkout Address
                </span>
              </div>
            )}
          </div>

          {/* Saved Wishlist Section */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                <span className="material-symbols-outlined text-[20px] fill">favorite</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800">Your Saved Wishlist</h4>
                <p className="text-[11px] text-slate-500">
                  {wishlistProductIds.length} {wishlistProductIds.length === 1 ? 'product' : 'products'} saved in your browser
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                closeCustomerAccount();
                openWishlist();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200/80 transition-colors cursor-pointer"
            >
              Open Wishlist
            </button>
          </div>

          {/* Your Orders History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#006d2f]">local_shipping</span>
                Your Orders & Tracking ({customerOrders.length})
              </h4>
              <span className="text-[11px] text-slate-500">Auto-synced by mobile number</span>
            </div>

            {customerOrders.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                <span className="material-symbols-outlined text-[32px] text-slate-300">shopping_bag</span>
                <p className="font-bold text-slate-700 text-xs">No orders placed yet</p>
                <p className="text-[11px] text-slate-500">
                  When you order via WhatsApp, your orders will appear here automatically for live tracking!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {customerOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#006d2f]">{order.id}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="font-bold text-xs text-[#131b2e] truncate mt-0.5">{order.productName}</p>
                        <p className="text-[10px] text-slate-500">
                          {order.colorSelected} • Qty: {order.quantity} • ৳{order.totalAmountBDT.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          closeCustomerAccount();
                          navigateToTracking(order.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#006d2f] text-white hover:bg-[#00471c] font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                        <span>Track Order</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Switch Customer */}
          <div className="p-3.5 bg-slate-100/80 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[11px] text-slate-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                Switch Customer Account (Demo Testing):
              </span>
              <button
                type="button"
                onClick={() => {
                  closeCustomerAccount();
                  openCustomerLogin('register');
                }}
                className="text-[11px] font-bold text-[#006d2f] hover:underline cursor-pointer"
              >
                + Add New Customer
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {customers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => quickSwitchCustomer(c.id)}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    c.id === currentCustomer.id
                      ? 'bg-emerald-100 border-[#006d2f] text-[#006d2f] font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="text-xs truncate leading-tight">{c.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{c.phone}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={logoutCustomer}
              className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign Out of Customer Account
            </button>
            <button
              type="button"
              onClick={closeCustomerAccount}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
