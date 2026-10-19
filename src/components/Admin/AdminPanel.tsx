import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, OrderStatus } from '../../types';
import { WhatsAppOrdersChartCard } from './WhatsAppOrdersChartCard';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    settings,
    adminTab,
    setAdminTab,
    setViewMode,
    navigateToProduct,
    navigateToTracking,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    updateOrderStatus,
    updateSettings,
    showToast,
    logout,
    currentUser,
    users,
    quickSwitchUser,
    openLoginGuide,
    updateProductStock,
    adjustProductStock,
    restoreAllProducts,
  } = useStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Delete Prompt Banner state
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);

  // Modal State (Add or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('Anker Soundcore 2 Bluetooth Speaker');
  const [formPrice, setFormPrice] = useState('3200');
  const [formCategory, setFormCategory] = useState<ProductCategory>('electronics');
  const [formImage, setFormImage] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBxL2Su60bDc59IXvongIgWrYch-00yAXh-YW4x2vZc4Kv3R6rbvNmxmWm_Mbxrt1IKCSVCNyDslTkWEqdhSG5xTU_ElXW8fuGPQ60jdQEgyW1_EkA4-Lu4QX7Lra8aoCxHCu2Lf_8zp3qUBidvqZwl7U2MiIOaZmZ1XBZpvSdSLT8P9VDetQjg8954dbjqux38_97GOCm79EDCJe3Qo9r1vYfhAQApl2MDkqu5YkcTH18UEmlc8SV2'
  );
  const [formDescription, setFormDescription] = useState(
    'Dual driver 12W sound, 24-hour battery backup, IPX7 waterproof. 1-year official brand warranty with direct replacement inside Bangladesh.'
  );
  const [formInStock, setFormInStock] = useState(true);
  const [formStockQuantity, setFormStockQuantity] = useState<number>(20);

  // WhatsApp Setup Form State
  const [settingsPhone, setSettingsPhone] = useState(settings.whatsappNumber);
  const [settingsFormatted, setSettingsFormatted] = useState(settings.formattedNumber);
  const [settingsDhakaFee, setSettingsDhakaFee] = useState(settings.dhakaDeliveryCharge.toString());
  const [settingsOutsideFee, setSettingsOutsideFee] = useState(settings.outsideDeliveryCharge.toString());
  const [settingsStoreName, setSettingsStoreName] = useState(settings.storeName);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, searchQuery]);

  // Paginated items
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;

  // Metrics
  const totalCount = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormName('Anker Soundcore 2 Bluetooth Speaker');
    setFormPrice('3200');
    setFormCategory('electronics');
    setFormImage(
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxL2Su60bDc59IXvongIgWrYch-00yAXh-YW4x2vZc4Kv3R6rbvNmxmWm_Mbxrt1IKCSVCNyDslTkWEqdhSG5xTU_ElXW8fuGPQ60jdQEgyW1_EkA4-Lu4QX7Lra8aoCxHCu2Lf_8zp3qUBidvqZwl7U2MiIOaZmZ1XBZpvSdSLT8P9VDetQjg8954dbjqux38_97GOCm79EDCJe3Qo9r1vYfhAQApl2MDkqu5YkcTH18UEmlc8SV2'
    );
    setFormDescription(
      'Dual driver 12W sound, 24-hour battery backup, IPX7 waterproof. 1-year official brand warranty with direct replacement inside Bangladesh.'
    );
    setFormInStock(true);
    setFormStockQuantity(20);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormPrice(p.priceBDT.toString());
    setFormCategory(p.category);
    setFormImage(p.image);
    setFormDescription(p.description);
    setFormInStock(p.inStock);
    setFormStockQuantity(p.stockQuantity ?? (p.inStock ? 10 : 0));
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice.replace(/[^0-9.]/g, '')) || 0;
    const stockNum = Math.max(0, parseInt(formStockQuantity.toString(), 10) || 0);
    const resolvedInStock = formInStock && stockNum > 0;

    const catLabels: Record<ProductCategory, string> = {
      electronics: 'Electronics',
      fashion: 'Fashion & Leather',
      home: 'Home & Living',
      accessories: 'Accessories',
    };

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formName,
        priceBDT: priceNum,
        category: formCategory,
        categoryLabel: catLabels[formCategory],
        image: formImage,
        description: formDescription,
        inStock: resolvedInStock,
        stockQuantity: stockNum,
      });
    } else {
      addProduct({
        name: formName,
        priceBDT: priceNum,
        originalPriceBDT: Math.round(priceNum * 1.15),
        category: formCategory,
        categoryLabel: catLabels[formCategory],
        image: formImage,
        description: formDescription,
        inStock: resolvedInStock,
        stockQuantity: stockNum,
        badge: 'New Arrival',
      });
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteCandidate) {
      deleteProduct(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'SKU', 'Name', 'Category', 'PriceBDT', 'StockStatus', 'Inquiries'];
    const rows = products.map((p) => [
      p.id,
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.priceBDT,
      p.inStock ? 'In Stock' : 'Out of Stock',
      p.inquiriesCount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dokanchat_catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Catalog exported as CSV!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      whatsappNumber: settingsPhone.replace(/[^0-9]/g, ''),
      formattedNumber: settingsFormatted,
      storeName: settingsStoreName,
      dhakaDeliveryCharge: parseFloat(settingsDhakaFee) || 60,
      outsideDeliveryCharge: parseFloat(settingsOutsideFee) || 120,
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex">
      {/* Sidebar (Matching Image 1) */}
      <aside className="fixed left-0 top-[37px] bottom-0 w-64 bg-[#f2f3ff] z-40 flex flex-col pt-6 pb-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#eaedff]">
        {/* DokanChat Logo */}
        <div className="px-6 mb-8 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#25d366] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <span className="material-symbols-outlined text-[18px]">chat</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm text-[#131b2e]">Dokan</span>
              <span className="font-extrabold text-sm text-[#006d2f]">Chat</span>
            </div>
            <span className="font-bold text-xs text-slate-500 block leading-none">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Active User Card in Sidebar */}
        <div className="px-4 mb-3">
          <div className="p-2.5 rounded-xl bg-white border border-[#dae2fd] shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#006d2f] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#131b2e] truncate leading-tight">
                  {currentUser?.name || 'Store Administrator'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]"></span>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {currentUser?.role || 'owner'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 space-y-1.5">
          <button
            onClick={() => setAdminTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
              adminTab === 'orders'
                ? 'bg-[#25d366] text-[#00471c] shadow-sm'
                : 'text-slate-600 hover:bg-[#e2e7ff] hover:text-[#131b2e]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">inbox</span>
              <span>Orders Queue</span>
            </div>
            {orders.filter((o) => o.status === 'new').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {orders.filter((o) => o.status === 'new').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('catalog')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
              adminTab === 'catalog'
                ? 'bg-[#25d366] text-[#00471c] shadow-sm'
                : 'text-slate-600 hover:bg-[#e2e7ff] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            <span>Product Catalog</span>
          </button>

          <button
            onClick={() => setAdminTab('whatsapp')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
              adminTab === 'whatsapp'
                ? 'bg-[#25d366] text-[#00471c] shadow-sm'
                : 'text-slate-600 hover:bg-[#e2e7ff] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>WhatsApp Setup</span>
          </button>
        </nav>

        {/* Bottom Go to Storefront & How to Login */}
        <div className="px-4 mt-auto pt-3 border-t border-[#eaedff] space-y-1">
          <button
            type="button"
            onClick={openLoginGuide}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-[#e2e7ff] transition-colors text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] text-[#006d2f]">help_center</span>
            <span>How to Login Guide</span>
          </button>

          <button
            onClick={() => setViewMode('storefront')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-[#e2e7ff] hover:text-[#131b2e] transition-colors text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">storefront</span>
            <span>Go to Storefront</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (pl-64) */}
      <div className="flex-1 pl-64">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#faf8ff]/90 backdrop-blur-xl border-b border-[#eaedff] sticky top-[37px] z-30 flex items-center justify-between px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              DokanChat Commerce Control
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-medium text-slate-600 hidden md:inline">
              Logged in as: <strong className="text-[#131b2e]">{currentUser?.name || 'Administrator'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openLoginGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006d2f]">help_center</span>
              <span className="hidden sm:inline">How to Login</span>
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#e2e7ff] text-[#131b2e] font-semibold text-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006d2f]">
                phone_iphone
              </span>
              <span>{settings.formattedNumber}</span>
            </a>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#006d2f] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-[#131b2e] block leading-tight truncate max-w-[120px]">
                  {currentUser?.name ? currentUser.name.split(' ')[0] : 'Admin'}
                </span>
                <span className="text-[9px] uppercase font-bold text-emerald-700 font-mono block">
                  {currentUser?.role || 'owner'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8">
          {adminTab === 'catalog' && (
            <div className="flex flex-col gap-6">
              {/* Top Command & Metrics Overview Bar */}
              <section className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#25d366] inline-block animate-pulse"></span>
                      <span className="text-[11px] text-[#006d2f] font-bold uppercase tracking-wider">
                        Live Catalog Sync
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
                      Product Catalog Management
                    </h1>
                    <p className="text-sm text-slate-600">
                      Manage your WhatsApp storefront inventory, pricing in BDT, and track direct inquiry leads.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleOpenAddModal}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_circle</span>
                      <span>+ Add New Product</span>
                    </button>
                  </div>
                </div>

                {/* 4 Quick Metrics Bar (Matching Image 1) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        Total Products
                      </span>
                      <div className="text-2xl font-black text-[#131b2e] mt-0.5 font-mono">
                        {totalCount}{' '}
                        <span className="text-xs text-[#006d2f] font-sans font-bold">Active</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#006d2f]">
                      <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        In Stock Ready
                      </span>
                      <div className="text-2xl font-black text-[#006d2f] mt-0.5 font-mono">
                        {inStockCount}{' '}
                        <span className="text-xs text-slate-500 font-sans font-normal">items</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#006d2f]">
                      <span className="material-symbols-outlined text-[22px]">check_circle</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        Low / Out of Stock
                      </span>
                      <div className="text-2xl font-black text-rose-600 mt-0.5 font-mono">
                        {outOfStockCount}{' '}
                        <span className="text-xs text-rose-600 font-sans font-bold">Attention</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                      <span className="material-symbols-outlined text-[22px]">warning</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        Storefront Status
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#25d366]"></span>
                        <span className="text-sm font-bold text-[#131b2e]">Online 🟢</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#8cf1e1]/30 flex items-center justify-center text-emerald-800">
                      <span className="material-symbols-outlined text-[22px]">store</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* WhatsApp Orders Line Chart Analytics Card */}
              <WhatsAppOrdersChartCard />

              {/* Filter & Action Controls */}
              <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by name, SKU or keyword..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#131b2e] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      aria-label="Filter by Category"
                      className="appearance-none bg-white px-4 py-2.5 pr-9 border border-slate-200 rounded-xl text-xs font-semibold text-[#131b2e] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#25d366] cursor-pointer"
                    >
                      <option value="all">All Categories ({products.length})</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion &amp; Leather</option>
                      <option value="home">Home &amp; Living</option>
                      <option value="accessories">Desk Accessories</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => restoreAllProducts()}
                    title="Restore all default catalog products while keeping any newly added products"
                    className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold text-xs shadow-xs hover:bg-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#006d2f]">restore</span>
                    <span>Restore All Products</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs shadow-xs hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">file_download</span>
                    <span>Export List</span>
                  </button>

                  <button
                    onClick={() => showToast('Column view: Product, Category, Price, Stock, Inquiries, Actions')}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs shadow-xs hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    <span>Columns</span>
                  </button>
                </div>
              </section>

              {/* Interactive Delete Confirmation Prompt Banner (Matching Image 1) */}
              {deleteCandidate && (
                <section className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-rose-600 shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">delete_forever</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rose-950">
                        Delete Confirmation Prompt
                      </p>
                      <p className="text-xs text-rose-800">
                        Are you sure you want to delete{' '}
                        <span className="font-bold underline">"{deleteCandidate.name}"</span>? This will immediately remove it from the WhatsApp storefront catalog.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => setDeleteCandidate(null)}
                      className="px-3.5 py-1.5 rounded-lg bg-white text-slate-700 text-xs font-semibold shadow-xs hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Keep Product
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Yes, Delete</span>
                    </button>
                  </div>
                </section>
              )}

              {/* Products Data Table (Level 1 Elevation) */}
              <section className="bg-white rounded-2xl border border-[#eaedff] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f2f3ff] text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-[#eaedff]">
                        <th className="py-3.5 px-6">Product Details</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price (BDT)</th>
                        <th className="py-3.5 px-4">Stock Status</th>
                        <th className="py-3.5 px-4">WhatsApp Inquiries</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {paginatedProducts.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-[#faf8ff] transition-colors"
                        >
                          {/* Product Details */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 shadow-xs border border-slate-200">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm text-[#131b2e] truncate max-w-xs">
                                  {p.name}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {p.sku}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4">
                            <span className="inline-flex px-2.5 py-1 rounded-md bg-[#e2e7ff] text-[#131b2e] font-semibold text-[11px]">
                              {p.categoryLabel}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4 font-mono font-bold text-sm text-[#131b2e]">
                            ৳ {p.priceBDT.toLocaleString()}
                          </td>

                          {/* Manual Stock Status & Interactive Stepper */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1.5 min-w-[140px]">
                              {/* Stock Status Badge with quick toggle */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleStock(p.id)}
                                  title="Click to toggle stock on/off"
                                  className="flex items-center gap-1 text-[11px] font-bold cursor-pointer group"
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${
                                      p.inStock
                                        ? p.stockQuantity <= 5
                                          ? 'bg-amber-500 animate-pulse'
                                          : 'bg-[#25d366]'
                                        : 'bg-rose-600'
                                    }`}
                                  />
                                  <span
                                    className={`underline decoration-dotted ${
                                      p.inStock
                                        ? p.stockQuantity <= 5
                                          ? 'text-amber-800'
                                          : 'text-[#005523]'
                                        : 'text-rose-700'
                                    }`}
                                  >
                                    {p.inStock
                                      ? p.stockQuantity <= 5
                                        ? `Low Stock (${p.stockQuantity})`
                                        : `In Stock (${p.stockQuantity})`
                                      : 'Out of Stock (0)'}
                                  </span>
                                </button>
                              </div>

                              {/* Manual Stock Quantity Stepper & Direct Numeric Input */}
                              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-lg p-0.5 w-fit shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => adjustProductStock(p.id, -1)}
                                  disabled={p.stockQuantity <= 0}
                                  className="w-6 h-6 rounded bg-white hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-white text-slate-800 font-bold flex items-center justify-center text-xs shadow-2xs cursor-pointer transition-colors"
                                  title="Decrease stock by 1"
                                >
                                  -
                                </button>

                                <input
                                  type="number"
                                  min="0"
                                  value={p.stockQuantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    updateProductStock(p.id, isNaN(val) ? 0 : Math.max(0, val));
                                  }}
                                  className="w-12 text-center py-0.5 px-0.5 text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                  title="Type exact stock quantity"
                                />

                                <button
                                  type="button"
                                  onClick={() => adjustProductStock(p.id, 1)}
                                  className="w-6 h-6 rounded bg-white hover:bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-xs shadow-2xs cursor-pointer transition-colors"
                                  title="Increase stock by 1"
                                >
                                  +
                                </button>

                                <button
                                  type="button"
                                  onClick={() => adjustProductStock(p.id, 5)}
                                  className="px-1.5 h-6 rounded bg-emerald-100 hover:bg-emerald-200 text-[#005523] text-[10px] font-bold flex items-center justify-center cursor-pointer transition-colors"
                                  title="Add +5 to stock"
                                >
                                  +5
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Inquiries */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-[#25d366]/15 flex items-center justify-center text-[#006d2f]">
                                <span className="material-symbols-outlined text-[15px]">chat</span>
                              </span>
                              <span className="font-semibold text-slate-700">
                                {p.inquiriesCount} inquiries
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => navigateToProduct(p.id)}
                                className="p-2 rounded-lg text-slate-400 hover:text-[#006d2f] hover:bg-slate-100 transition-colors cursor-pointer"
                                title="View on Live Store"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  open_in_new
                                </span>
                              </button>

                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-2 rounded-lg text-slate-400 hover:text-[#131b2e] hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>

                              <button
                                onClick={() => setDeleteCandidate(p)}
                                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination & Count Helper */}
                <div className="p-4 bg-[#f2f3ff] border-t border-[#eaedff] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-medium">
                  <span>
                    Showing <strong>{paginatedProducts.length}</strong> of{' '}
                    <strong>{filteredProducts.length}</strong> active products
                  </span>

                  <div className="flex items-center gap-1 font-semibold">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                          currentPage === page
                            ? 'bg-[#25d366] text-[#00471c] font-bold shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Orders Queue Tab */}
          {adminTab === 'orders' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#131b2e] tracking-tight">
                  Customer Orders Queue
                </h1>
                <p className="text-sm text-slate-600">
                  Manage incoming customer WhatsApp orders, addresses, and delivery status dispatch.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#eaedff] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#f2f3ff] text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-[#eaedff]">
                        <th className="py-3.5 px-6">Order ID &amp; Time</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Product Ordered</th>
                        <th className="py-3.5 px-4">Courier &amp; Consignment</th>
                        <th className="py-3.5 px-4">Total (BDT)</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-6 text-right">Live Tracking</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#faf8ff] transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-slate-900">
                            <div>{ord.id}</div>
                            <span className="text-[11px] text-slate-400 font-normal font-sans">
                              {ord.timestamp}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-900">{ord.customerName}</div>
                            <div className="text-slate-500 font-mono text-[11px]">
                              {ord.customerPhone}
                            </div>
                            <div className="text-slate-400 text-[10px] truncate max-w-[160px]">
                              {ord.address}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-900">{ord.productName}</div>
                            <div className="text-[11px] text-slate-500">
                              Edition: {ord.colorSelected || 'Standard'} (Qty: {ord.quantity})
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px] text-emerald-700">local_shipping</span>
                              <span>{ord.courierPartner || 'Steadfast Courier'}</span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 font-bold">
                              {ord.consignmentId || 'Pending Consignment'}
                            </div>
                            <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 font-bold text-[9px] uppercase text-slate-600 mt-0.5">
                              {ord.district === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-slate-900">
                            ৳{ord.totalAmountBDT.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                updateOrderStatus(ord.id, e.target.value as OrderStatus)
                              }
                              aria-label="Order Status"
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                                ord.status === 'new'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : ord.status === 'confirmed'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : ord.status === 'shipped'
                                  ? 'bg-purple-50 text-purple-800 border-purple-300'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              <option value="new">🟡 New</option>
                              <option value="confirmed">🔵 Confirmed</option>
                              <option value="shipped">🟣 Shipped</option>
                              <option value="delivered">🟢 Delivered</option>
                            </select>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => navigateToTracking(ord.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60 font-semibold text-xs transition-colors cursor-pointer"
                              title="View Customer Tracking Portal"
                            >
                              <span className="material-symbols-outlined text-[15px]">travel_explore</span>
                              <span>Track</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Setup Tab */}
          {adminTab === 'whatsapp' && (
            <div className="max-w-2xl bg-white rounded-2xl border border-[#eaedff] p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#006d2f] text-[24px]">chat</span>
                <h1 className="text-xl font-extrabold text-[#131b2e]">WhatsApp Merchant Setup</h1>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Configure your store WhatsApp business number, greeting message template, and delivery charge defaults.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settingsStoreName}
                    onChange={(e) => setSettingsStoreName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#131b2e] focus:ring-2 focus:ring-[#25d366] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Number (International format)
                    </label>
                    <input
                      type="text"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      placeholder="8801700123456"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#131b2e] focus:ring-2 focus:ring-[#25d366] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Display Number
                    </label>
                    <input
                      type="text"
                      value={settingsFormatted}
                      onChange={(e) => setSettingsFormatted(e.target.value)}
                      placeholder="+880 1700-123456"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#131b2e] focus:ring-2 focus:ring-[#25d366] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dhaka Delivery Charge (৳ BDT)
                    </label>
                    <input
                      type="number"
                      value={settingsDhakaFee}
                      onChange={(e) => setSettingsDhakaFee(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#131b2e] focus:ring-2 focus:ring-[#25d366] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Outside Dhaka Delivery Charge (৳ BDT)
                    </label>
                    <input
                      type="number"
                      value={settingsOutsideFee}
                      onChange={(e) => setSettingsOutsideFee(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#131b2e] focus:ring-2 focus:ring-[#25d366] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Save Store Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* In-page Interactive Modal Component Overlay: Add / Edit Product (Matching Image 1) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-6 bg-[#f2f3ff] border-b border-[#eaedff] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006d2f] block">
                  Fast Storefront Publish
                </span>
                <h2 className="text-xl font-extrabold text-[#131b2e]">
                  {editingProductId ? 'Edit Product Details' : 'Add New Product to Storefront'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">
                  Product Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Anker Soundcore 2 Bluetooth Speaker"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#131b2e] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                  required
                />
                <p className="text-[11px] text-slate-500">
                  Keep it concise so buyers can identify it immediately in WhatsApp chat preview.
                </p>
              </div>

              {/* Price & Category Dual Column */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-800">
                    Price in BDT (৳) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 font-mono">
                      ৳
                    </span>
                    <input
                      type="text"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="3,200"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-[#131b2e] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-800">
                    Category <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                      className="w-full appearance-none px-4 py-2.5 pr-8 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#131b2e] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#25d366] cursor-pointer"
                    >
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion &amp; Leather</option>
                      <option value="home">Home &amp; Living</option>
                      <option value="accessories">Accessories</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Image Upload Drag & Drop Zone */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">Product Image URL / Upload</label>
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-slate-200 hover:bg-[#e2e7ff] transition-colors flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white overflow-hidden shrink-0 shadow-xs border border-slate-200 relative group">
                    <img
                      src={formImage}
                      alt="Product preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-[#006d2f] font-bold text-xs">
                      <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                      <span>Product Photography Ready</span>
                    </div>
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="Enter Image URL..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700"
                    />
                    <p className="text-[10px] text-slate-500">
                      Square 1:1 format (min 800×800px) converts best on mobile WhatsApp previews.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">Product Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter key features, warranty details, and colors..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#131b2e] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#25d366] resize-none"
                />
              </div>

              {/* Manual Stock Quantity & Availability Management */}
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#25d366]/20 flex items-center justify-center text-[#006d2f]">
                      <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                    </span>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Manual Stock Quantity</p>
                      <p className="text-[11px] text-slate-500">
                        Adjust stock as needed. When set to 0, it automatically marks as Out of Stock.
                      </p>
                    </div>
                  </div>

                  {/* Quick In-Stock Switch */}
                  <label className="relative inline-flex items-center cursor-pointer" title="Toggle In-Stock">
                    <input
                      type="checkbox"
                      checked={formInStock && formStockQuantity > 0}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormInStock(checked);
                        if (!checked) {
                          setFormStockQuantity(0);
                        } else if (formStockQuantity === 0) {
                          setFormStockQuantity(10);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25d366]"></div>
                  </label>
                </div>

                {/* Stock Numeric Input and Stepper */}
                <div className="bg-white rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Units in Stock <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500">
                      {formStockQuantity > 0
                        ? `✅ In Stock (${formStockQuantity} units available for WhatsApp purchase)`
                        : '⚠️ Currently Out of Stock (0 units)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.max(0, formStockQuantity - 1);
                        setFormStockQuantity(next);
                        if (next === 0) setFormInStock(false);
                      }}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm cursor-pointer shadow-2xs transition-colors"
                      title="Decrease by 1"
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={formStockQuantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const cleanVal = isNaN(val) ? 0 : Math.max(0, val);
                        setFormStockQuantity(cleanVal);
                        setFormInStock(cleanVal > 0);
                      }}
                      className="w-20 text-center py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-sm text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#25d366]"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const next = formStockQuantity + 1;
                        setFormStockQuantity(next);
                        setFormInStock(true);
                      }}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm cursor-pointer shadow-2xs transition-colors"
                      title="Increase by 1"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Stock Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">Quick Add:</span>
                  {[5, 10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        const next = formStockQuantity + amt;
                        setFormStockQuantity(next);
                        setFormInStock(true);
                      }}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 font-semibold text-[11px] cursor-pointer transition-colors shadow-2xs"
                    >
                      +{amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormStockQuantity(0);
                      setFormInStock(false);
                    }}
                    className="ml-auto px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-[11px] cursor-pointer transition-colors"
                  >
                    Clear to 0 (Out of Stock)
                  </button>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-[#00471c] font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>{editingProductId ? 'Update Product' : 'Save & Publish to Store'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
