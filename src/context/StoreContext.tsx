import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, validateFirestoreConnection } from '../firebase';
import { Product, StoreSettings, OrderInquiry, ViewMode, AdminTab, ProductReview, UserAccount, UserRole, CustomerAccount } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_USERS, INITIAL_CUSTOMERS } from '../data/initialProducts';

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface OrderSimulatorState {
  isOpen: boolean;
  product: Product | null;
  selectedColor?: string;
  customerNote?: string;
}

interface StoreContextType {
  products: Product[];
  orders: OrderInquiry[];
  reviews: ProductReview[];
  settings: StoreSettings;
  viewMode: ViewMode;
  selectedProductId: string;
  adminTab: AdminTab;
  isAuthenticated: boolean;
  toast: ToastInfo | null;
  orderSimulator: OrderSimulatorState;
  activeTrackingId: string | null;
  
  // Database & Multi-device Sync Status
  isDatabaseConnected: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  refreshDatabase: () => Promise<void>;
  restoreAllProducts: () => Promise<void>;
  
  activeProductTab: 'details' | 'reviews' | 'how-it-works';
  
  // Navigation
  setViewMode: (mode: ViewMode) => void;
  setSelectedProductId: (id: string) => void;
  setActiveProductTab: (tab: 'details' | 'reviews' | 'how-it-works') => void;
  setAdminTab: (tab: AdminTab) => void;
  navigateToProduct: (id: string, tab?: 'details' | 'reviews' | 'how-it-works') => void;
  setActiveTrackingId: (id: string | null) => void;
  navigateToTracking: (orderId?: string) => void;
  
  // Auth & Admin Users
  currentUser: UserAccount | null;
  users: UserAccount[];
  isLoginGuideOpen: boolean;
  setIsLoginGuideOpen: (open: boolean) => void;
  openLoginGuide: () => void;
  closeLoginGuide: () => void;
  login: (username: string, pass: string) => boolean;
  registerUser: (newUser: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
  }) => boolean;
  logout: () => void;
  quickSwitchUser: (userId: string) => void;

  // Customer Auth & Accounts
  currentCustomer: CustomerAccount | null;
  customers: CustomerAccount[];
  isCustomerLoginOpen: boolean;
  isCustomerAccountModalOpen: boolean;
  customerLoginInitialTab: 'login' | 'register';
  setIsCustomerLoginOpen: (open: boolean) => void;
  setIsCustomerAccountModalOpen: (open: boolean) => void;
  openCustomerLogin: (initialTab?: 'login' | 'register') => void;
  closeCustomerLogin: () => void;
  openCustomerAccount: () => void;
  closeCustomerAccount: () => void;
  loginCustomer: (phoneOrEmail: string, password?: string) => { success: boolean; error?: string };
  registerCustomer: (newCustomer: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
    district: 'dhaka' | 'outside';
    address: string;
  }) => { success: boolean; error?: string };
  logoutCustomer: () => void;
  updateCustomerProfile: (updates: Partial<CustomerAccount>) => void;
  quickSwitchCustomer: (customerId: string) => void;
  
  // Products
  addProduct: (product: Omit<Product, 'id' | 'sku' | 'inquiriesCount' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
  updateProductStock: (id: string, newQuantity: number) => void;
  adjustProductStock: (id: string, delta: number) => void;

  // Reviews & Ratings
  addReview: (review: Omit<ProductReview, 'id' | 'timestamp' | 'helpfulCount'>) => void;
  toggleReviewHelpful: (reviewId: string) => void;
  
  // Orders & Tracking
  createOrder: (order: Omit<OrderInquiry, 'id' | 'timestamp' | 'status'>) => OrderInquiry;
  updateOrderStatus: (id: string, status: OrderInquiry['status']) => void;
  updateOrderTracking: (id: string, updates: Partial<OrderInquiry>) => void;
  findOrder: (query: string) => OrderInquiry | undefined;
  
  // Storefront Catalog Search & Filtering
  catalogSearchQuery: string;
  setCatalogSearchQuery: (query: string) => void;
  catalogCategory: string;
  setCatalogCategory: (category: string) => void;
  catalogInStockOnly: boolean;
  setCatalogInStockOnly: (inStockOnly: boolean) => void;
  catalogSortBy: 'featured' | 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'inquiries';
  setCatalogSortBy: (sort: 'featured' | 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'inquiries') => void;
  catalogPriceRange: 'all' | 'under-1500' | '1500-3000' | 'above-3000';
  setCatalogPriceRange: (range: 'all' | 'under-1500' | '1500-3000' | 'above-3000') => void;
  resetCatalogFilters: () => void;
  searchCatalog: (query: string, category?: string) => void;

  // Wishlist
  wishlistProductIds: string[];
  wishlistProducts: Product[];
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  shareWishlistOnWhatsApp: () => void;

  // Settings
  updateSettings: (updates: Partial<StoreSettings>) => void;
  
  // Feedback & WhatsApp
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  openWhatsAppOrder: (product: Product, selectedColor?: string, customNote?: string) => void;
  closeOrderSimulator: () => void;
  generateWhatsAppUrl: (product: Product, selectedColor?: string, customNote?: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'dokanchat_products_v1',
  SETTINGS: 'dokanchat_settings_v1',
  ORDERS: 'dokanchat_orders_v1',
  REVIEWS: 'dokanchat_reviews_v1',
  AUTH: 'dokanchat_auth_v1',
  USERS: 'dokanchat_users_v1',
  CURRENT_USER: 'dokanchat_current_user_v1',
  CUSTOMERS: 'dokanchat_customers_v1',
  CURRENT_CUSTOMER: 'dokanchat_current_customer_v1',
  WISHLIST: 'dokanchat_wishlist_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SETTINGS;
  });

  const [orders, setOrders] = useState<OrderInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const parsed: OrderInquiry[] = JSON.parse(saved);
        if (parsed.length > 0 && parsed[0].trackingEvents) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_REVIEWS;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
      const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
      if (isAuth) return INITIAL_USERS[0];
    } catch {
      // fallback
    }
    return null;
  });

  // Customer State
  const [customers, setCustomers] = useState<CustomerAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CUSTOMERS;
  });

  const [currentCustomer, setCurrentCustomer] = useState<CustomerAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_CUSTOMER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState<boolean>(false);
  const [isCustomerAccountModalOpen, setIsCustomerAccountModalOpen] = useState<boolean>(false);
  const [customerLoginInitialTab, setCustomerLoginInitialTab] = useState<'login' | 'register'>('login');

  const [isLoginGuideOpen, setIsLoginGuideOpen] = useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [viewMode, setViewMode] = useState<ViewMode>('storefront');
  const [selectedProductId, setSelectedProductId] = useState<string>('earbuds-pro-wireless');
  const [activeProductTab, setActiveProductTab] = useState<'details' | 'reviews' | 'how-it-works'>('details');
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>('ORD-9021');
  const [adminTab, setAdminTab] = useState<AdminTab>('catalog');
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [orderSimulator, setOrderSimulator] = useState<OrderSimulatorState>({
    isOpen: false,
    product: null,
  });

  // Storefront Catalog Search & Filtering State
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>('');
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [catalogInStockOnly, setCatalogInStockOnly] = useState<boolean>(false);
  const [catalogSortBy, setCatalogSortBy] = useState<'featured' | 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'inquiries'>('popularity');
  const [catalogPriceRange, setCatalogPriceRange] = useState<'all' | 'under-1500' | '1500-3000' | 'above-3000'>('all');

  const resetCatalogFilters = () => {
    setCatalogSearchQuery('');
    setCatalogCategory('all');
    setCatalogInStockOnly(false);
    setCatalogSortBy('featured');
    setCatalogPriceRange('all');
  };

  const searchCatalog = (query: string, category?: string) => {
    setCatalogSearchQuery(query);
    if (category) {
      setCatalogCategory(category);
    }
    setViewMode('storefront');
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Wishlist State & Storage
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['earbuds-pro-wireless'];
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // Database Connection & Synchronization Status
  const [isDatabaseConnected, setIsDatabaseConnected] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Verify and listen to real-time Firestore collections across devices
  useEffect(() => {
    let isMounted = true;

    // Check connectivity on startup
    validateFirestoreConnection()
      .then((connected) => {
        if (isMounted) setIsDatabaseConnected(connected);
      })
      .catch(() => {
        if (isMounted) {
          setIsDatabaseConnected(false);
          setSyncStatus('offline');
        }
      });

    // 1. Sync Products in Real-time from Firestore
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const prods = snapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
          })) as Product[];
          setProducts(prods);
          setIsDatabaseConnected(true);
          setSyncStatus('synced');
          try {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
          } catch (_) {}
        } else {
          // Newly provisioned database -> Seed initial products to Firestore
          const batch = writeBatch(db);
          INITIAL_PRODUCTS.forEach((prod) => {
            const ref = doc(db, 'products', prod.id);
            batch.set(ref, prod);
          });
          batch
            .commit()
            .then(() => {
              if (isMounted) {
                setIsDatabaseConnected(true);
                setSyncStatus('synced');
              }
            })
            .catch((err) => {
              handleFirestoreError(err, OperationType.WRITE, 'products');
            });
        }
      },
      (err) => {
        if (!isMounted) return;
        setIsDatabaseConnected(false);
        setSyncStatus('offline');
        handleFirestoreError(err, OperationType.GET, 'products');
      }
    );

    // 2. Sync Orders in Real-time from Firestore
    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const ords = snapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
          })) as OrderInquiry[];
          setOrders(ords);
          try {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ords));
          } catch (_) {}
        } else {
          // Seed initial orders
          const batch = writeBatch(db);
          INITIAL_ORDERS.forEach((ord) => {
            const ref = doc(db, 'orders', ord.id);
            batch.set(ref, ord);
          });
          batch.commit().catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, 'orders');
          });
        }
      },
      (err) => {
        if (!isMounted) return;
        handleFirestoreError(err, OperationType.GET, 'orders');
      }
    );

    // 3. Sync Store Settings in Real-time from Firestore
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'store_config'),
      (docSnap) => {
        if (!isMounted) return;
        if (docSnap.exists()) {
          const s = docSnap.data() as StoreSettings;
          setSettings(s);
          try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));
          } catch (_) {}
        } else {
          // Initialize settings
          setDoc(doc(db, 'settings', 'store_config'), INITIAL_SETTINGS).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, 'settings/store_config');
          });
        }
      },
      (err) => {
        if (!isMounted) return;
        handleFirestoreError(err, OperationType.GET, 'settings/store_config');
      }
    );

    // 4. Sync Reviews in Real-time from Firestore
    const unsubReviews = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const revs = snapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
          })) as ProductReview[];
          setReviews(revs);
          try {
            localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(revs));
          } catch (_) {}
        } else {
          const batch = writeBatch(db);
          INITIAL_REVIEWS.forEach((rev) => {
            const ref = doc(db, 'reviews', rev.id);
            batch.set(ref, rev);
          });
          batch.commit().catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, 'reviews');
          });
        }
      },
      (err) => {
        if (!isMounted) return;
        handleFirestoreError(err, OperationType.GET, 'reviews');
      }
    );

    // 5. Sync Customers in Real-time from Firestore
    const unsubCustomers = onSnapshot(
      collection(db, 'customers'),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const custs = snapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
          })) as CustomerAccount[];
          setCustomers(custs);
          try {
            localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(custs));
          } catch (_) {}
        } else {
          const batch = writeBatch(db);
          INITIAL_CUSTOMERS.forEach((cust) => {
            const ref = doc(db, 'customers', cust.id);
            batch.set(ref, cust);
          });
          batch.commit().catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, 'customers');
          });
        }
      },
      (err) => {
        if (!isMounted) return;
        handleFirestoreError(err, OperationType.GET, 'customers');
      }
    );

    return () => {
      isMounted = false;
      unsubProducts();
      unsubOrders();
      unsubSettings();
      unsubReviews();
      unsubCustomers();
    };
  }, []);

  const refreshDatabase = async () => {
    try {
      setSyncStatus('syncing');
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        const prods = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Product[];
        setProducts(prods);
      }
      setSyncStatus('synced');
      setIsDatabaseConnected(true);
      showToast('Products refreshed from Cloud Database!', 'success');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.GET, 'products');
    }
  };

  const restoreAllProducts = async () => {
    try {
      setSyncStatus('syncing');
      const snap = await getDocs(collection(db, 'products'));
      const existingMap = new Map<string, Product>();
      snap.forEach((d) => {
        existingMap.set(d.id, { ...(d.data() as Product), id: d.id });
      });

      // Write any missing initial products
      const batch = writeBatch(db);
      let addedCount = 0;
      INITIAL_PRODUCTS.forEach((p) => {
        if (!existingMap.has(p.id)) {
          const ref = doc(db, 'products', p.id);
          batch.set(ref, p);
          existingMap.set(p.id, p);
          addedCount++;
        }
      });

      if (addedCount > 0) {
        await batch.commit();
      }

      const mergedList = Array.from(existingMap.values());
      setProducts(mergedList);
      setSyncStatus('synced');
      setIsDatabaseConnected(true);
      showToast(`All ${mergedList.length} products active and synchronized with Cloud Database!`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products');
    }
  };

  const toggleWishlist = (productId: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    const productName = targetProduct ? targetProduct.name : 'Product';

    setWishlistProductIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed "${productName}" from Wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${productName}" to Wishlist ❤️`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistProductIds.includes(productId);
  };

  const clearWishlist = () => {
    setWishlistProductIds([]);
    showToast('Wishlist cleared', 'info');
  };

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  const wishlistProducts = useMemo(() => {
    return wishlistProductIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [wishlistProductIds, products]);

  const shareWishlistOnWhatsApp = () => {
    if (wishlistProducts.length === 0) return;
    const itemsText = wishlistProducts
      .map(
        (p, idx) =>
          `${idx + 1}. ${p.name} - ৳${p.priceBDT.toLocaleString()} (${p.inStock ? 'In Stock' : 'Out of Stock'})`
      )
      .join('\n');
    const totalBDT = wishlistProducts.reduce((sum, p) => sum + p.priceBDT, 0);

    const message = `Hello ${settings.storeName}! I am interested in ordering these items from my Wishlist:\n\n${itemsText}\n\n*Total Estimated Price:* ৳${totalBDT.toLocaleString()}\n\nPlease confirm availability and delivery to my address. Thank you!`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      if (currentCustomer) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_CUSTOMER, JSON.stringify(currentCustomer));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_CUSTOMER);
      }
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [currentCustomer]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [isAuthenticated]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3800);
  };

  const openLoginGuide = () => setIsLoginGuideOpen(true);
  const closeLoginGuide = () => setIsLoginGuideOpen(false);

  const login = (usernameOrEmail: string, pass: string): boolean => {
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check registered users list first
    const matched = users.find((u) => {
      const matchEmail = u.email.toLowerCase() === cleanInput;
      const matchName = u.name.toLowerCase() === cleanInput;
      const matchAdminAlias = (u.id === 'usr-admin-demo' || u.role === 'owner') && cleanInput === 'admin';
      return matchEmail || matchName || matchAdminAlias;
    });

    if (matched) {
      const isPasswordValid = matched.password
        ? (matched.password === cleanPass || cleanPass === 'password')
        : cleanPass === 'password';

      if (isPasswordValid) {
        setCurrentUser(matched);
        setIsAuthenticated(true);
        setViewMode('admin-panel');
        showToast(`Welcome back, ${matched.name}! Signed in as ${matched.role}.`, 'success');
        return true;
      }
    }

    // Direct fallback for standard demo admin credentials
    if ((cleanInput === 'admin' || cleanInput === 'owner@dokanchat.com') && cleanPass === 'password') {
      const defaultOwner = users[0] || INITIAL_USERS[0];
      setCurrentUser(defaultOwner);
      setIsAuthenticated(true);
      setViewMode('admin-panel');
      showToast('Signed in successfully to DokanChat Admin Panel!', 'success');
      return true;
    }

    showToast('Invalid credentials. Check email/password or click "Register New User".', 'error');
    return false;
  };

  const registerUser = (newUser: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
  }): boolean => {
    const cleanEmail = newUser.email.trim().toLowerCase();
    if (!newUser.name.trim() || newUser.name.trim().length < 2) {
      showToast('Please enter your full name.', 'error');
      return false;
    }
    if (!cleanEmail || cleanEmail.length < 3) {
      showToast('Please enter a valid email or username.', 'error');
      return false;
    }
    if (!newUser.password || newUser.password.length < 4) {
      showToast('Password must be at least 4 characters long.', 'error');
      return false;
    }

    const alreadyExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (alreadyExists) {
      showToast(`User with email "${cleanEmail}" already exists. Please sign in instead.`, 'error');
      return false;
    }

    const created: UserAccount = {
      id: `usr-${Date.now()}`,
      name: newUser.name.trim(),
      email: cleanEmail,
      password: newUser.password.trim(),
      role: newUser.role,
      phone: newUser.phone?.trim() || undefined,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newUser.name.trim())}&backgroundColor=006d2f,25d366,131b2e`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [created, ...prev]);
    setCurrentUser(created);
    setIsAuthenticated(true);
    setViewMode('admin-panel');
    showToast(`🎉 New user "${created.name}" registered and logged in as ${created.role}!`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setViewMode('admin-login');
    showToast('Logged out of Admin Portal', 'info');
  };

  const quickSwitchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
      setViewMode('admin-panel');
      showToast(`Active account switched to ${target.name} (${target.role})`, 'info');
    }
  };

  // Customer Management & Auth
  const openCustomerLogin = (initialTab: 'login' | 'register' = 'login') => {
    setCustomerLoginInitialTab(initialTab);
    setIsCustomerLoginOpen(true);
  };

  const closeCustomerLogin = () => {
    setIsCustomerLoginOpen(false);
  };

  const openCustomerAccount = () => {
    setIsCustomerAccountModalOpen(true);
  };

  const closeCustomerAccount = () => {
    setIsCustomerAccountModalOpen(false);
  };

  const normalizePhone = (phoneStr: string): string => {
    return phoneStr.replace(/\D/g, '');
  };

  const loginCustomer = (phoneOrEmail: string, pass?: string): { success: boolean; error?: string } => {
    const cleanInput = phoneOrEmail.trim().toLowerCase();
    const cleanDigits = normalizePhone(phoneOrEmail);
    const cleanPass = pass?.trim() || '';

    const matched = customers.find((c) => {
      const emailMatch = c.email?.toLowerCase() === cleanInput;
      const phoneDigits = normalizePhone(c.phone);
      const phoneMatch = phoneDigits.length >= 8 && (phoneDigits.includes(cleanDigits) || cleanDigits.includes(phoneDigits));
      const nameMatch = c.name.toLowerCase() === cleanInput;
      return emailMatch || phoneMatch || nameMatch;
    });

    if (matched) {
      if (cleanPass && matched.password && matched.password !== cleanPass && cleanPass !== 'password') {
        const err = 'Incorrect password. Try again or use default demo password "password".';
        showToast(err, 'error');
        return { success: false, error: err };
      }

      setCurrentCustomer(matched);
      setIsCustomerLoginOpen(false);
      showToast(`Welcome back, ${matched.name}! Customer account signed in.`, 'success');
      return { success: true };
    }

    const errorMsg = 'No customer found with that phone or email. Please register your account.';
    showToast(errorMsg, 'error');
    return { success: false, error: errorMsg };
  };

  const registerCustomer = (newCustomer: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
    district: 'dhaka' | 'outside';
    address: string;
  }): { success: boolean; error?: string } => {
    if (!newCustomer.name.trim() || newCustomer.name.trim().length < 2) {
      const err = 'Please enter your full name.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    const cleanDigits = normalizePhone(newCustomer.phone);
    if (cleanDigits.length < 8) {
      const err = 'Please enter a valid mobile number (e.g. 01711-234567).';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    if (!newCustomer.address.trim() || newCustomer.address.trim().length < 5) {
      const err = 'Please enter your detailed delivery address.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    const alreadyExists = customers.find((c) => {
      const existingDigits = normalizePhone(c.phone);
      return existingDigits === cleanDigits || (newCustomer.email && c.email?.toLowerCase() === newCustomer.email.trim().toLowerCase());
    });

    if (alreadyExists) {
      setCurrentCustomer(alreadyExists);
      setIsCustomerLoginOpen(false);
      showToast(`Welcome back! Logged in with existing customer profile (${alreadyExists.name}).`, 'info');
      return { success: true };
    }

    const created: CustomerAccount = {
      id: `cust-${Date.now()}`,
      name: newCustomer.name.trim(),
      phone: newCustomer.phone.trim(),
      email: newCustomer.email?.trim() || undefined,
      password: newCustomer.password?.trim() || 'password',
      district: newCustomer.district,
      address: newCustomer.address.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newCustomer.name.trim())}&backgroundColor=006d2f,25d366,00471c`,
      createdAt: new Date().toISOString(),
    };

    setCustomers((prev) => [created, ...prev]);
    setCurrentCustomer(created);
    setIsCustomerLoginOpen(false);
    showToast(`🎉 Welcome to DokanChat, ${created.name}! Customer account created.`, 'success');

    // Persist to Cloud Database
    setDoc(doc(db, 'customers', created.id), created).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `customers/${created.id}`);
    });

    return { success: true };
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
    setIsCustomerAccountModalOpen(false);
    showToast('Signed out of customer account.', 'info');
  };

  const updateCustomerProfile = (updates: Partial<CustomerAccount>) => {
    if (!currentCustomer) return;
    const updated = { ...currentCustomer, ...updates };
    setCurrentCustomer(updated);
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast('Customer profile updated successfully!', 'success');

    // Update in Cloud Database
    setDoc(doc(db, 'customers', updated.id), updated, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `customers/${updated.id}`);
    });
  };

  const quickSwitchCustomer = (customerId: string) => {
    const target = customers.find((c) => c.id === customerId);
    if (target) {
      setCurrentCustomer(target);
      setIsCustomerAccountModalOpen(false);
      setIsCustomerLoginOpen(false);
      showToast(`Switched active customer to ${target.name}`, 'info');
    }
  };


  const navigateToProduct = (id: string, tab: 'details' | 'reviews' | 'how-it-works' = 'details') => {
    setSelectedProductId(id);
    setActiveProductTab(tab);
    setViewMode('product-detail');
    if (tab === 'reviews') {
      setTimeout(() => {
        document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToTracking = (orderId?: string) => {
    if (orderId) {
      setActiveTrackingId(orderId);
    } else if (!activeTrackingId && orders.length > 0) {
      setActiveTrackingId(orders[0].id);
    }
    setViewMode('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const findOrder = (query: string): OrderInquiry | undefined => {
    const clean = query.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return undefined;
    return orders.find((o) => {
      const idClean = o.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const phoneClean = o.customerPhone.replace(/[^0-9]/g, '');
      const consignClean = o.consignmentId ? o.consignmentId.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
      return idClean.includes(clean) || phoneClean.includes(clean) || (consignClean && consignClean.includes(clean));
    });
  };

  const addProduct = (newProd: Omit<Product, 'id' | 'sku' | 'inquiriesCount' | 'rating' | 'reviewsCount'>) => {
    const id = newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
    const skuPrefix = newProd.category.substring(0, 2).toUpperCase();
    const skuNum = Math.floor(100 + Math.random() * 900);
    const created: Product = {
      ...newProd,
      id,
      sku: `SKU-${skuPrefix}-${skuNum}`,
      inquiriesCount: 0,
      rating: 5.0,
      reviewsCount: 1,
    };
    setProducts((prev) => [created, ...prev.filter((p) => p.id !== id)]);
    showToast(`"${created.name}" published live to Cloud Database!`, 'success');

    // Persist to Firestore
    setSyncStatus('syncing');
    setDoc(doc(db, 'products', id), created)
      .then(() => setSyncStatus('synced'))
      .catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
      });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let targetProduct: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          targetProduct = { ...p, ...updates };
          return targetProduct;
        }
        return p;
      })
    );
    showToast('Product details updated in Database!');

    if (targetProduct) {
      setSyncStatus('syncing');
      setDoc(doc(db, 'products', id), targetProduct, { merge: true })
        .then(() => setSyncStatus('synced'))
        .catch((err) => {
          handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
        });
    }
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`"${target?.name || 'Product'}" removed from Cloud Database.`, 'info');

    setSyncStatus('syncing');
    deleteDoc(doc(db, 'products', id))
      .then(() => setSyncStatus('synced'))
      .catch((err) => {
        handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
      });
  };

  const toggleStock = (id: string) => {
    let nextStock = false;
    let nextQuantity = 0;
    let targetUpdated: Product | undefined;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          nextStock = !p.inStock;
          nextQuantity = nextStock ? (p.stockQuantity > 0 ? p.stockQuantity : 10) : 0;
          targetUpdated = {
            ...p,
            inStock: nextStock,
            stockQuantity: nextQuantity,
          };
          showToast(
            `${p.name} is now marked ${nextStock ? 'In Stock' : 'Out of Stock'}`
          );
          return targetUpdated;
        }
        return p;
      })
    );

    if (targetUpdated) {
      setSyncStatus('syncing');
      setDoc(doc(db, 'products', id), targetUpdated, { merge: true })
        .then(() => setSyncStatus('synced'))
        .catch((err) => {
          handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
        });
    }
  };

  const updateProductStock = (id: string, newQuantity: number) => {
    const qty = Math.max(0, Math.floor(newQuantity));
    const isNowInStock = qty > 0;
    let targetUpdated: Product | undefined;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          targetUpdated = {
            ...p,
            stockQuantity: qty,
            inStock: isNowInStock,
          };
          return targetUpdated;
        }
        return p;
      })
    );
    showToast(`Stock updated to ${qty} items (synced to database)`, 'success');

    if (targetUpdated) {
      setSyncStatus('syncing');
      setDoc(doc(db, 'products', id), targetUpdated, { merge: true })
        .then(() => setSyncStatus('synced'))
        .catch((err) => {
          handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
        });
    }
  };

  const adjustProductStock = (id: string, delta: number) => {
    let targetUpdated: Product | undefined;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const currentQty = p.stockQuantity ?? (p.inStock ? 10 : 0);
          const updatedQty = Math.max(0, currentQty + delta);
          const nextInStock = updatedQty > 0;
          targetUpdated = {
            ...p,
            stockQuantity: updatedQty,
            inStock: nextInStock,
          };
          return targetUpdated;
        }
        return p;
      })
    );

    if (targetUpdated) {
      setSyncStatus('syncing');
      setDoc(doc(db, 'products', id), targetUpdated, { merge: true })
        .then(() => setSyncStatus('synced'))
        .catch((err) => {
          handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
        });
    }
  };

  const addReview = (newRevData: Omit<ProductReview, 'id' | 'timestamp' | 'helpfulCount'>) => {
    const newRev: ProductReview = {
      ...newRevData,
      id: `rev-${Date.now()}`,
      timestamp: 'Just now',
      helpfulCount: 0,
    };
    const nextReviews = [newRev, ...reviews];
    setReviews(nextReviews);

    // Recalculate target product rating and reviewsCount
    const productReviews = nextReviews.filter((r) => r.productId === newRevData.productId);
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((sum / productReviews.length) * 10) / 10;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === newRevData.productId) {
          return {
            ...p,
            rating: avg,
            reviewsCount: p.reviewsCount + 1,
            verifiedCustomersCount: (p.verifiedCustomersCount || 100) + 1,
          };
        }
        return p;
      })
    );

    showToast(`Thank you, ${newRev.authorName}! Your review has been published.`);

    // Persist review to Firestore
    setDoc(doc(db, 'reviews', newRev.id), newRev).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `reviews/${newRev.id}`);
    });
    // Update target product's rating in Firestore
    setDoc(
      doc(db, 'products', newRevData.productId),
      {
        rating: avg,
        reviewsCount: (products.find((p) => p.id === newRevData.productId)?.reviewsCount || 0) + 1,
      },
      { merge: true }
    ).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `products/${newRevData.productId}`);
    });
  };

  const toggleReviewHelpful = (reviewId: string) => {
    let nextCount = 1;
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          nextCount = (r.helpfulCount || 0) + 1;
          return { ...r, helpfulCount: nextCount };
        }
        return r;
      })
    );
    showToast('Marked review as helpful!');

    setDoc(doc(db, 'reviews', reviewId), { helpfulCount: nextCount }, { merge: true }).catch(
      (err) => {
        handleFirestoreError(err, OperationType.UPDATE, `reviews/${reviewId}`);
      }
    );
  };

  const createOrder = (orderData: Omit<OrderInquiry, 'id' | 'timestamp' | 'status'>): OrderInquiry => {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const courier = orderData.district === 'dhaka' ? 'Pathao Express' : 'Steadfast Courier';
    const consignmentId = orderData.district === 'dhaka'
      ? `PTH-DH-${Math.floor(10000 + Math.random() * 90000)}`
      : `STDF-BD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: OrderInquiry = {
      ...orderData,
      id,
      timestamp: 'Just now',
      status: 'new',
      courierPartner: courier,
      consignmentId,
      estimatedDeliveryDate:
        orderData.district === 'dhaka'
          ? 'Tomorrow, within 24-48 Hours'
          : 'Within 48-72 Hours via Courier',
      trackingEvents: [
        {
          title: 'Order Initiated via WhatsApp',
          location: 'Customer WhatsApp Chat',
          timestamp: 'Just now',
          completed: true,
        },
        {
          title: 'Store Verification & Invoice Generated',
          location: 'DokanChat Central Store',
          timestamp: 'Reviewing',
          completed: false,
        },
        {
          title: `Dispatched with ${courier}`,
          location: orderData.district === 'dhaka' ? 'Dhaka Hub' : 'Courier Transit Hub',
          timestamp: 'Pending Dispatch',
          completed: false,
        },
        {
          title: 'Delivered (Cash on Delivery Payable)',
          location: orderData.address || 'Customer Delivery Address',
          timestamp: 'Pending Delivery',
          completed: false,
        },
      ],
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Also increment product inquiry count
    setProducts((prev) =>
      prev.map((p) =>
        p.id === orderData.productId
          ? { ...p, inquiriesCount: p.inquiriesCount + 1 }
          : p
      )
    );

    setActiveTrackingId(id);
    showToast(`Order ${id} registered with tracking number ${consignmentId}!`);

    // Persist order to Firestore database
    setDoc(doc(db, 'orders', id), newOrder).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `orders/${id}`);
    });
    setDoc(
      doc(db, 'products', orderData.productId),
      {
        inquiriesCount:
          (products.find((p) => p.id === orderData.productId)?.inquiriesCount || 0) + 1,
      },
      { merge: true }
    ).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `products/${orderData.productId}`);
    });

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderInquiry['status']) => {
    let updatedOrderObj: OrderInquiry | undefined;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updatedEvents = o.trackingEvents
            ? o.trackingEvents.map((evt, idx) => {
                if (status === 'confirmed' && idx <= 1) return { ...evt, completed: true };
                if (status === 'shipped' && idx <= 2) return { ...evt, completed: true };
                if (status === 'delivered') return { ...evt, completed: true };
                return evt;
              })
            : o.trackingEvents;

          updatedOrderObj = { ...o, status, trackingEvents: updatedEvents };
          return updatedOrderObj;
        }
        return o;
      })
    );
    showToast(`Order status updated to "${status.toUpperCase()}"`);

    if (updatedOrderObj) {
      setDoc(doc(db, 'orders', id), updatedOrderObj, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${id}`);
      });
    }
  };

  const updateOrderTracking = (id: string, updates: Partial<OrderInquiry>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
    showToast('Order tracking details updated!');

    setDoc(doc(db, 'orders', id), updates, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${id}`);
    });
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Store settings saved successfully to Cloud Database!');

    setDoc(doc(db, 'settings', 'store_config'), updates, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, 'settings/store_config');
    });
  };

  const generateWhatsAppUrl = (product: Product, selectedColor?: string, customNote?: string): string => {
    const colorStr = selectedColor ? ` (${selectedColor})` : '';
    const noteStr = customNote ? `\nNote: ${customNote}` : '';
    const message = `Hello! I am interested in ordering this product.
Product: ${product.name}${colorStr}
Price: ৳${product.priceBDT.toLocaleString()}
SKU: ${product.sku}
Product Link: https://dokanchat.com/products/${product.id}${noteStr}
Please let me know about product availability and delivery. Thank you!`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${settings.whatsappNumber}?text=${encoded}`;
  };

  const openWhatsAppOrder = (product: Product, selectedColor?: string, customNote?: string) => {
    // Increment inquiries
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, inquiriesCount: p.inquiriesCount + 1 } : p
      )
    );

    // Open real WhatsApp in new window
    const url = generateWhatsAppUrl(product, selectedColor, customNote);
    window.open(url, '_blank');

    // Also open the in-app interactive preview / simulator
    setOrderSimulator({
      isOpen: true,
      product,
      selectedColor,
      customerNote: customNote,
    });
  };

  const closeOrderSimulator = () => {
    setOrderSimulator({ isOpen: false, product: null });
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        reviews,
        settings,
        viewMode,
        selectedProductId,
        activeProductTab,
        activeTrackingId,
        adminTab,
        isAuthenticated,
        isDatabaseConnected,
        syncStatus,
        refreshDatabase,
        restoreAllProducts,
        currentUser,
        users,
        isLoginGuideOpen,
        setIsLoginGuideOpen,
        openLoginGuide,
        closeLoginGuide,
        currentCustomer,
        customers,
        isCustomerLoginOpen,
        isCustomerAccountModalOpen,
        customerLoginInitialTab,
        setIsCustomerLoginOpen,
        setIsCustomerAccountModalOpen,
        openCustomerLogin,
        closeCustomerLogin,
        openCustomerAccount,
        closeCustomerAccount,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        updateCustomerProfile,
        quickSwitchCustomer,
        catalogSearchQuery,
        setCatalogSearchQuery,
        catalogCategory,
        setCatalogCategory,
        catalogInStockOnly,
        setCatalogInStockOnly,
        catalogSortBy,
        setCatalogSortBy,
        catalogPriceRange,
        setCatalogPriceRange,
        resetCatalogFilters,
        searchCatalog,
        wishlistProductIds,
        wishlistProducts,
        isWishlistOpen,
        setIsWishlistOpen,
        openWishlist,
        closeWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        shareWishlistOnWhatsApp,
        toast,
        orderSimulator,
        setViewMode,
        setSelectedProductId,
        setActiveProductTab,
        setActiveTrackingId,
        setAdminTab,
        navigateToProduct,
        navigateToTracking,
        findOrder,
        login,
        registerUser,
        logout,
        quickSwitchUser,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        updateProductStock,
        adjustProductStock,
        addReview,
        toggleReviewHelpful,
        createOrder,
        updateOrderStatus,
        updateOrderTracking,
        updateSettings,
        showToast,
        openWhatsAppOrder,
        closeOrderSimulator,
        generateWhatsAppUrl,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
