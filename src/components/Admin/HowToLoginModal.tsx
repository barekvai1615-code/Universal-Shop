import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

interface HowToLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegisterTab?: () => void;
}

export const HowToLoginModal: React.FC<HowToLoginModalProps> = ({
  isOpen,
  onClose,
  onSelectRegisterTab,
}) => {
  const { login, setViewMode, openCustomerLogin, customers, quickSwitchCustomer } = useStore();
  const [activeTab, setActiveTab] = useState<'customer' | 'admin' | 'quick-demo'>('customer');

  if (!isOpen) return null;

  const handleQuickAdminLogin = (email: string) => {
    login(email, 'password');
    onClose();
  };

  const handleQuickCustomerLogin = (customerId: string) => {
    quickSwitchCustomer(customerId);
    onClose();
  };

  const handleGoToAdminRegister = () => {
    setViewMode('admin-login');
    if (onSelectRegisterTab) {
      onSelectRegisterTab();
    }
    onClose();
  };

  const handleGoToCustomerLogin = (tab: 'login' | 'register') => {
    onClose();
    openCustomerLogin(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#131b2e] to-[#1e293b] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25d366] text-[#003816] flex items-center justify-center font-bold shadow-sm">
              <span className="material-symbols-outlined text-[24px]">help_center</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>How to Login to DokanChat</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  User Guide
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Complete walkthrough for Shoppers &amp; Customers, Store Owners, and Staff Members
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close guide"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-3 gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('customer')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'customer'
                ? 'border-[#006d2f] text-[#006d2f]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>1. Customer &amp; Shopper Login</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'admin'
                ? 'border-[#006d2f] text-[#006d2f]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>2. Store Admin &amp; Staff Login</span>
          </button>

          <button
            onClick={() => setActiveTab('quick-demo')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'quick-demo'
                ? 'border-[#006d2f] text-[#006d2f]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>3. Instant Demo Accounts</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm">
          {/* Customer Login Guide */}
          {activeTab === 'customer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-700 text-[24px] shrink-0 mt-0.5">
                  account_circle
                </span>
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm mb-1">
                    How Customer Login Works on DokanChat
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Customers have two flexible ways to use DokanChat: they can create a <strong>Customer Account</strong> to save their delivery address for 1-click checkout, or order directly as a guest via WhatsApp!
                  </p>
                </div>
              </div>

              {/* Steps for customer login */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#25d366]/20 text-[#006d2f] flex items-center justify-center shrink-0 font-bold text-xs font-mono">
                    01
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                      Click &quot;Customer Login&quot; in the Header or Banner
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tap the green <strong>&quot;Customer Login&quot;</strong> button in the top navigation bar or the announcement bar.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#25d366]/20 text-[#006d2f] flex items-center justify-center shrink-0 font-bold text-xs font-mono">
                    02
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                      Sign In with Mobile Number or Create New Customer Account
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Enter your WhatsApp phone number (e.g. <em>01812-445566</em>) or email. New customers can switch to <strong>&quot;Create Customer Account&quot;</strong> to save their default delivery address (Inside or Outside Dhaka).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#25d366]/20 text-[#006d2f] flex items-center justify-center shrink-0 font-bold text-xs font-mono">
                    03
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                      Enjoy 1-Click WhatsApp Ordering &amp; Order Tracking
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      When logged in, your checkout slip is automatically pre-filled with your saved delivery address, and your past orders are linked for instant 1-click live courier tracking!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                <span className="text-xs text-slate-500">
                  Try logging in or creating a customer account right now:
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleGoToCustomerLogin('login')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#006d2f] hover:bg-[#00471c] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">login</span>
                    <span>Customer Sign In</span>
                  </button>
                  <button
                    onClick={() => handleGoToCustomerLogin('register')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    <span>Register New Customer</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admin & Staff Login Guide */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-3">
                <span className="material-symbols-outlined text-slate-700 text-[22px] shrink-0 mt-0.5">
                  admin_panel_settings
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">
                    Store Owner &amp; Staff Login / Registration
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    DokanChat allows store owners, inventory managers, customer support reps, and fulfillment staff to create and login with role-based team accounts.
                  </p>
                </div>
              </div>

              {/* Step cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-xs">
                      <span className="w-5 h-5 rounded-full bg-[#131b2e] text-white flex items-center justify-center text-[11px] font-mono">
                        1
                      </span>
                      <span>Go to Admin Portal</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Click <strong>&quot;Staff / Admin&quot;</strong> in the header or click <strong>&quot;4. Admin Login&quot;</strong> in the top switcher bar.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-xs">
                      <span className="w-5 h-5 rounded-full bg-[#131b2e] text-white flex items-center justify-center text-[11px] font-mono">
                        2
                      </span>
                      <span>Switch to &quot;Register New User&quot;</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      On the login page, click the <strong>&quot;Register New User&quot;</strong> tab to onboard team members without server dependencies.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between sm:col-span-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-xs">
                      <span className="w-5 h-5 rounded-full bg-[#131b2e] text-white flex items-center justify-center text-[11px] font-mono">
                        3
                      </span>
                      <span>Select Role &amp; Access Permissions</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      Enter full name, email/username, password, and choose team role:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-900 block">👑 Store Owner</span>
                        <span className="text-slate-500 text-[10px]">Full permissions &amp; settings</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-900 block">📦 Product Mgr</span>
                        <span className="text-slate-500 text-[10px]">Catalog &amp; inventory</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-900 block">🚚 Fulfillment</span>
                        <span className="text-slate-500 text-[10px]">Orders &amp; courier dispatch</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-900 block">💬 Support Lead</span>
                        <span className="text-slate-500 text-[10px]">Customer chats &amp; reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                <span className="text-xs text-slate-500">
                  Ready to test creating a store staff account?
                </span>
                <button
                  onClick={handleGoToAdminRegister}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>Register a New Staff User</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Accounts */}
          {activeTab === 'quick-demo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-3">
                <span className="material-symbols-outlined text-purple-700 text-[22px] shrink-0 mt-0.5">
                  bolt
                </span>
                <div>
                  <h3 className="font-bold text-purple-900 text-sm mb-1">
                    1-Click Instant Demo Testing Accounts
                  </h3>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    Click any test customer or staff member below to immediately sign in and test the workflow without typing!
                  </p>
                </div>
              </div>

              {/* Demo Customers Section */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#006d2f]">person</span>
                  <span>Shopper &amp; Customer Accounts:</span>
                </h4>
                <div className="space-y-2">
                  {customers.map((cust) => (
                    <div
                      key={cust.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={cust.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${cust.name}`}
                          alt={cust.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-300"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs truncate">{cust.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {cust.phone} • {cust.district === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickCustomerLogin(cust.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors cursor-pointer shrink-0"
                      >
                        Login as Customer
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Staff Section */}
              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-700">admin_panel_settings</span>
                  <span>Store Admin &amp; Staff Accounts:</span>
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-400 transition-colors flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        👑
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs truncate">Mustafa Rahman (Store Owner)</p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">owner@dokanchat.com · pass: password</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickAdminLogin('owner@dokanchat.com')}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Login as Owner
                    </button>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-400 transition-colors flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        📦
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs truncate">Tanvir Ahmed (Product Manager)</p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">manager@dokanchat.com · pass: password</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickAdminLogin('manager@dokanchat.com')}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-colors cursor-pointer shrink-0"
                    >
                      Login as Manager
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            DokanChat Authentication System
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
