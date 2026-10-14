import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import { HowToLoginModal } from './HowToLoginModal';

export const AdminLogin: React.FC = () => {
  const {
    login,
    registerUser,
    setViewMode,
    users,
    isLoginGuideOpen,
    openLoginGuide,
    closeLoginGuide,
    openCustomerLogin,
  } = useStore();
  
  // Tab: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('owner@dokanchat.com');
  const [loginPassword, setLoginPassword] = useState('password');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('manager');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginIdentifier, loginPassword);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || regName.trim().length < 2) {
      setRegError('Please provide your full name (at least 2 characters).');
      return;
    }
    if (!regEmail.trim() || regEmail.trim().length < 3) {
      setRegError('Please enter a valid email or username.');
      return;
    }
    if (regPassword.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    const success = registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim() || undefined,
      role: regRole,
      password: regPassword.trim(),
    });

    if (success) {
      // Clear form
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirmPassword('');
    }
  };

  const handleAutoFillAdmin = () => {
    setLoginIdentifier('owner@dokanchat.com');
    setLoginPassword('password');
    setMode('login');
  };

  const handleSelectQuickUser = (email: string) => {
    setLoginIdentifier(email);
    setLoginPassword('password');
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-center items-center p-4 sm:p-6 py-10">
      {/* Centered Login & Registration Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-[#eaedff] overflow-hidden">
        {/* Brand Header */}
        <div className="p-6 sm:p-8 pb-4 flex flex-col items-center text-center bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100">
          {/* DokanChat Logo Lockup */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-200/80 shadow-xs mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#25d366] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <span className="material-symbols-outlined text-[19px]">chat</span>
            </div>
            <div className="text-left">
              <span className="text-base font-extrabold text-[#131b2e] leading-tight block">
                Dokan<span className="text-[#006d2f]">Chat</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 block uppercase">
                Shop Direct on WhatsApp
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#131b2e] tracking-tight">
            {mode === 'login' ? 'Merchant Portal Sign In' : 'Register New User Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            {mode === 'login'
              ? 'Access product inventory, update BDT prices, and manage WhatsApp orders.'
              : 'Add a new manager, owner, or staff user to manage your DokanChat store.'}
          </p>

          {/* Interactive "How to Login" Banner Button */}
          <button
            type="button"
            onClick={openLoginGuide}
            className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-bold border border-emerald-200 transition-all cursor-pointer shadow-2xs group"
          >
            <span className="material-symbols-outlined text-[17px] text-[#006d2f] group-hover:rotate-12 transition-transform">
              help_center
            </span>
            <span>How to Login &amp; Register? (User Guide)</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Register New User */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 mx-6 mt-4 rounded-xl text-xs font-bold border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setRegError(null);
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#131b2e] shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setRegError(null);
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-[#25d366] text-[#003816] shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Register New User</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 pt-5">
          {mode === 'login' ? (
            /* ================= SIGN IN TAB ================= */
            <div>
              {/* Quick Demo Helper Box */}
              <div className="mb-5 p-3.5 rounded-2xl bg-[#f2f3ff] border border-[#dae2fd] text-left">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px] text-[#006d2f]">
                      verified
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Quick Demo Accounts
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillAdmin}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-slate-50 text-emerald-800 text-[11px] font-bold shadow-2xs border border-slate-200 transition-colors cursor-pointer"
                  >
                    Auto-fill Admin
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {users.slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectQuickUser(u.email)}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                        loginIdentifier.toLowerCase() === u.email.toLowerCase()
                          ? 'bg-[#006d2f] text-white border-[#006d2f] font-bold'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-medium'
                      }`}
                    >
                      <span>
                        {u.role === 'owner' ? '👑' : u.role === 'manager' ? '📦' : '💬'}
                      </span>
                      <span className="truncate max-w-[110px]">{u.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                    Email or Username
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      person
                    </span>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. owner@dokanchat.com or admin"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#131b2e] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#131b2e]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setLoginPassword('password')}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Fill default (password)
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      lock
                    </span>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#131b2e] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showLoginPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Remember this device</span>
                  </label>

                  <button
                    type="button"
                    onClick={openLoginGuide}
                    className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 underline cursor-pointer"
                  >
                    Need help?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                  <span>Sign In to Dashboard</span>
                </button>
              </form>

              {/* Switch to Register callout */}
              <div className="mt-5 text-center pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Don&apos;t have a user account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-bold text-[#006d2f] hover:underline cursor-pointer ml-1"
                  >
                    Register New User
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* ================= REGISTER NEW USER TAB ================= */
            <div>
              {/* How it works info banner */}
              <div className="mb-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-left flex items-start gap-2.5">
                <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 mt-0.5">
                  info
                </span>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Fill in your details to create a new user. It is saved in local storage and grants immediate access to the DokanChat administration panel.
                </p>
              </div>

              {regError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">
                    error
                  </span>
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      badge
                    </span>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rakib Hassan"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#131b2e] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                      required
                    />
                  </div>
                </div>

                {/* Email / Username */}
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">
                    Email / Login Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      mail
                    </span>
                    <input
                      type="text"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. rakib@dokanchat.com or rakib_store"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#131b2e] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Role Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1">
                      Phone Number <span className="text-slate-400 text-[10px]">(Optional)</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                        call
                      </span>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="01712-XXXXXX"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#131b2e] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1">
                      Store Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#131b2e] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#25d366] font-medium"
                    >
                      <option value="owner">👑 Store Owner (Full Access)</option>
                      <option value="manager">📦 Product &amp; Stock Manager</option>
                      <option value="fulfillment">🚚 Order &amp; Delivery Staff</option>
                      <option value="support">💬 Customer Support Agent</option>
                    </select>
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                        lock
                      </span>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 4 chars"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#131b2e] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                        required
                        minLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                        lock_reset
                      </span>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#131b2e] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        <span className="material-symbols-outlined text-[17px]">
                          {showRegPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-3.5 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span>Create Account &amp; Sign In</span>
                </button>
              </form>

              {/* Switch back to login */}
              <div className="mt-4 text-center pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-[#006d2f] hover:underline cursor-pointer ml-1"
                  >
                    Back to Sign In
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Banner Area */}
        <div className="p-5 sm:p-6 bg-[#f2f3ff] border-t border-[#dae2fd] text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-700 font-semibold">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">security</span>
            <span>Protected Management Area</span>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={openLoginGuide}
              className="text-[#006d2f] hover:underline font-bold"
            >
              How Login Works
            </button>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
            Authorized store staff can update live catalogs, prices in BDT, and manage WhatsApp direct orders.
          </p>
          <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">Looking for customer / shopper account?</span>
            <button
              type="button"
              onClick={() => {
                setViewMode('storefront');
                openCustomerLogin('login');
              }}
              className="text-[#006d2f] hover:text-[#00471c] font-bold flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span>Customer Login &amp; Register</span>
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setViewMode('storefront')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Return to Public Storefront</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Modal Guide */}
      <HowToLoginModal
        isOpen={isLoginGuideOpen}
        onClose={closeLoginGuide}
        onSelectRegisterTab={() => setMode('register')}
      />
    </div>
  );
};
