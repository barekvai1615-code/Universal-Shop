/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopSwitcher } from './components/TopSwitcher';
import { StorefrontPage } from './components/Storefront/StorefrontPage';
import { ProductDetailPage } from './components/ProductDetail/ProductDetailPage';
import { OrderTrackingPage } from './components/Tracking/OrderTrackingPage';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminPanel } from './components/Admin/AdminPanel';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { Toast } from './components/Toast';
import { HowToLoginModal } from './components/Admin/HowToLoginModal';
import { CustomerLoginModal } from './components/Customer/CustomerLoginModal';
import { CustomerAccountModal } from './components/Customer/CustomerAccountModal';
import { WishlistOverlay } from './components/Storefront/WishlistOverlay';

const AppContent: React.FC = () => {
  const { viewMode, isAuthenticated, isLoginGuideOpen, closeLoginGuide } = useStore();

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans">
      <TopSwitcher />

      <div className="flex-1">
        {viewMode === 'storefront' && <StorefrontPage />}
        {viewMode === 'product-detail' && <ProductDetailPage />}
        {viewMode === 'order-tracking' && <OrderTrackingPage />}
        {viewMode === 'admin-login' && <AdminLogin />}
        {viewMode === 'admin-panel' && (isAuthenticated ? <AdminPanel /> : <AdminLogin />)}
      </div>

      <WhatsAppOrderModal />
      <CustomerLoginModal />
      <CustomerAccountModal />
      <WishlistOverlay />
      <HowToLoginModal isOpen={isLoginGuideOpen} onClose={closeLoginGuide} />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
