export type ProductCategory = 'electronics' | 'fashion' | 'home' | 'accessories';

export interface ProductSpec {
  label: string;
  value: string;
  icon?: string;
}

export interface ProductColor {
  name: string;
  available: boolean;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  categoryLabel: string;
  priceBDT: number;
  originalPriceBDT?: number;
  inStock: boolean;
  stockQuantity: number;
  inquiriesCount: number;
  image: string;
  thumbnails?: { id: string; label: string; url: string }[];
  description: string;
  specs?: ProductSpec[];
  colors?: ProductColor[];
  rating: number;
  reviewsCount: number;
  badge?: string;
  deliveryDays?: string;
  verifiedCustomersCount?: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  location: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedPurchase: boolean;
  timestamp: string;
  helpfulCount: number;
}

export type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderInquiry {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  customerName: string;
  customerPhone: string;
  district: 'dhaka' | 'outside';
  address?: string;
  colorSelected?: string;
  quantity: number;
  productPriceBDT: number;
  deliveryChargeBDT: number;
  totalAmountBDT: number;
  timestamp: string;
  status: OrderStatus;
  notes?: string;
  courierPartner?: string;
  consignmentId?: string;
  estimatedDeliveryDate?: string;
  trackingEvents?: {
    title: string;
    location: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface StoreSettings {
  whatsappNumber: string;
  formattedNumber: string;
  storeName: string;
  dhakaDeliveryCharge: number;
  outsideDeliveryCharge: number;
  isStoreOnline: boolean;
  messageTemplate: string;
}

export type ViewMode = 'storefront' | 'product-detail' | 'order-tracking' | 'admin-login' | 'admin-panel';
export type AdminTab = 'catalog' | 'orders' | 'whatsapp';

export type UserRole = 'owner' | 'manager' | 'fulfillment' | 'support';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password?: string;
  district: 'dhaka' | 'outside';
  address: string;
  avatarUrl?: string;
  createdAt: string;
}

