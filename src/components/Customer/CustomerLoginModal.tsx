import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const CustomerLoginModal: React.FC = () => {
  const {
    isCustomerLoginOpen,
    closeCustomerLogin,
    customerLoginInitialTab,
    loginCustomer,
    registerCustomer,
    customers,
    quickSwitchCustomer,
    setViewMode,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(customerLoginInitialTab || 'login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('password');
  const [regDistrict, setRegDistrict] = useState<'dhaka' | 'outside'>('dhaka');
  const [regAddress, setRegAddress] = useState('');
  const [regError, setRegError] = useState('');

  if (!isCustomerLoginOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your mobile phone number or email.');
      return;
    }
    const res = loginCustomer(loginIdentifier, loginPassword);
    if (!res.success && res.error) {
      setLoginError(res.error);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!regPhone.trim()) {
      setRegError('Please enter your mobile phone number.');
      return;
    }
    if (!regAddress.trim()) {
      setRegError('Please enter your delivery address.');
      return;
    }

    const res = registerCustomer({
      name: regName,
      phone: regPhone,
      email: regEmail || undefined,
      password: regPassword || 'password',
      district: regDistrict,
      address: regAddress,
    });

    if (!res.success && res.error) {
      setRegError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006d2f] to-[#00471c] text-white p-5 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25d366] text-[#00471c] flex items-center justify-center shadow-xs font-bold">
              <span className="material-symbols-outlined text-[22px]">person</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base leading-tight">Customer Account</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-200 border border-emerald-400/30 text-[10px] font-semibold">
                  Fast WhatsApp Checkout
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Sign in to auto-fill delivery addresses & track your orders with 1-click
              </p>
            </div>
          </div>
          <button
            onClick={closeCustomerLogin}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-[#f8f9ff] shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
            }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'border-[#006d2f] text-[#006d2f] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Customer Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegError('');
            }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'border-[#006d2f] text-[#006d2f] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Create Customer Account
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#faf8ff] text-xs text-[#131b2e]">
          {/* Quick Demo Customer Sign-in Pills */}
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/90 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[11px] text-emerald-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#25d366]">bolt</span>
                1-Click Demo Customer Login:
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Click to instantly log in</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {customers.slice(0, 3).map((cust) => (
                <button
                  key={cust.id}
                  type="button"
                  onClick={() => quickSwitchCustomer(cust.id)}
                  className="p-2 bg-white hover:bg-emerald-100/60 rounded-lg border border-emerald-200 text-left transition-all hover:shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={cust.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${cust.name}`}
                      alt={cust.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-emerald-300"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[11px] text-[#131b2e] group-hover:text-[#006d2f] truncate leading-tight">
                        {cust.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{cust.phone}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'login' ? (
            /* Sign In Tab */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <span className="material-symbols-outlined text-[18px] text-rose-600">error</span>
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number or Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                    call
                  </span>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => {
                      setLoginIdentifier(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="e.g. 01812-445566 or customer@email.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006d2f] focus:border-transparent outline-none transition-all shadow-2xs"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Tip: You can log in using your WhatsApp number or email
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[11px] text-emerald-800 font-medium">Demo password: password</span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006d2f] focus:border-transparent outline-none transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#006d2f] to-[#25d366] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Sign In to Customer Account
              </button>
            </form>
          ) : (
            /* Register Tab */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <span className="material-symbols-outlined text-[18px] text-rose-600">error</span>
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Shakil Mahmud"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006d2f] outline-none shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+880 1712-345678"
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006d2f] outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="shakil@gmail.com"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006d2f] outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Delivery Region / City <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      regDistrict === 'dhaka'
                        ? 'border-[#006d2f] bg-emerald-50 text-[#006d2f] font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="regDistrict"
                      checked={regDistrict === 'dhaka'}
                      onChange={() => setRegDistrict('dhaka')}
                      className="accent-[#006d2f]"
                    />
                    <span>Inside Dhaka (৳60)</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      regDistrict === 'outside'
                        ? 'border-[#006d2f] bg-emerald-50 text-[#006d2f] font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="regDistrict"
                      checked={regDistrict === 'outside'}
                      onChange={() => setRegDistrict('outside')}
                      className="accent-[#006d2f]"
                    />
                    <span>Outside Dhaka (৳120)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Delivery Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="House number, road name/number, area, landmark..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006d2f] outline-none shadow-2xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Password <span className="text-slate-400 font-normal">(Defaults to "password")</span>
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Set account password"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#006d2f] outline-none shadow-2xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#006d2f] to-[#25d366] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Create Customer Account & Auto-Login
              </button>
            </form>
          )}

          {/* Customer Perks Card */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <h4 className="font-bold text-[11px] text-slate-800 mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-500">hotel_class</span>
              Why create a DokanChat Customer Account?
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[14px]">check_circle</span>
                <span><strong>Instant WhatsApp Checkout:</strong> Your address & phone auto-fill automatically.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[14px]">check_circle</span>
                <span><strong>1-Click Order Tracking:</strong> View live courier tracking without copying tracking IDs.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[14px]">check_circle</span>
                <span><strong>Verified Reviews:</strong> Share authentic feedback with a Verified Customer badge.</span>
              </li>
            </ul>
          </div>

          {/* Switch to Admin link */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Store owner or staff member?</span>
            <button
              type="button"
              onClick={() => {
                closeCustomerLogin();
                setViewMode('admin-login');
              }}
              className="text-[#006d2f] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Switch to Admin Portal</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
