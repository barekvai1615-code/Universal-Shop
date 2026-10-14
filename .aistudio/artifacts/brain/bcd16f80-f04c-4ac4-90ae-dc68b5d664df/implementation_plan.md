# DokanChat & Universal Shop — Direct WhatsApp E-Commerce Platform

A high-converting direct-to-WhatsApp social commerce platform tailored for the Bangladeshi market ("Universal Shop") paired with a full-featured merchant administration console ("DokanChat Admin Panel"). Built to reflect the provided reference screens with pixel-accurate visual fidelity, live reactive inventory synchronization, rich product galleries, interactive WhatsApp message generators, and administrative catalog management.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during initial planning:
> - **WhatsApp Ordering Behavior**: Open WhatsApp (`wa.me`) with URL-encoded pre-filled order text while simultaneously offering an in-app interactive order preview & verification drawer.
> - **Data Persistence & Real-Time Sync**: Synchronized via reactive local browser storage with automatic state propagation between the Admin Panel and the public Storefront.
> - **Preview Mode Navigation**: A persistent, unobtrusive top switcher bar allowing instant 1-click toggling between the Customer Storefront, the Merchant Login screen (with 1-click demo credential auto-fill: `admin` / `password`), and the Live Admin Panel.

---

## 1. Overview & Core Concept

- **What It Does**: DokanChat bridges frictionless conversational commerce with structured store management. Customers in Bangladesh can browse trending lifestyle and electronics products in Bangladeshi Taka (৳ BDT), configure variants, inspect delivery options (Dhaka vs Outside Dhaka), and place zero-friction orders via pre-formatted WhatsApp chat inquiries. Merchants manage the inventory, pricing, out-of-stock statuses, and incoming inquiry leads through an authenticated DokanChat Admin Panel.
- **Target Audience**: Social sellers, D2C Bangladeshi brands, and mobile-first shoppers seeking instant WhatsApp confirmation without complex cart checkout flows or passwords.
- **Key Value**: Eliminates cart abandonment by converting browsing directly into high-intent WhatsApp discussions and orders with pre-calculated pricing and delivery terms.

---

## 2. User Experience & Visual Design

### Key Screens & User Flows

1. **Storefront Home (`Universal Shop`)**:
   - **Top Announcement Bar**: "BD Nationwide Delivery Across Bangladesh • Direct WhatsApp Order & Fast Confirmation" with direct phone dialer and Admin Portal shortcut.
   - **Header**: Clean 3-zone contract with Universal Shop branding, primary navigation links (Home, Products, How to Order, Contact), customer WhatsApp helpline button, and Admin Portal link.
   - **Hero Section**: Catchy value proposition ("Discover Quality Essentials You'll Love"), CTA buttons ("Explore Products", "How WhatsApp Ordering Works"), and an interactive WhatsApp conversation preview widget illustrating real customer chat confirmation.
   - **Trust Pillars**: Instant chat response, nationwide 64-district delivery, cash on delivery (COD), and 7-day genuine replacement guarantee.
   - **How It Works (3 Steps)**: 01 Browse & Pick Product -> 02 Click 'Order on WhatsApp' -> 03 Confirm Delivery & Pay.
   - **Trending Products Grid**: Category filter tabs (All Products, Electronics & Audio, Home & Lifestyle, Fashion & Leather, Desk Accessories), instant keyword search, sorting (Featured, Price Low-High, Price High-Low, Most Popular), and cards showing image, badges, SKU, star ratings, price in BDT, and direct "Order on WhatsApp" button.
   - **Direct Support Callout Banner**: WhatsApp shop manager direct inquiry card.
   - **Comprehensive Footer**: Quick links, customer support hours, payment & COD badges, and DokanChat copyright.

2. **Product Detail Page (PDP)**:
   - **Breadcrumbs Navigation**: e.g., `Home / Products / Audio / Wireless Noise-Canceling Earbuds Pro`.
   - **Interactive Media Showcase**: Large primary zoomable photo view with 4 interactive thumbnail perspectives (Hero View, Case Open, In-Ear Fit, In The Box).
   - **Purchase Module**:
     - Status badges ("In Stock • Ready to Dispatch", "Same Day Dispatch Dhaka", "Original Brand Guaranteed").
     - Dual-currency pricing display (e.g. ৳2,450 strike-through ৳2,900, "Save ৳450 (15% OFF)").
     - Key specifications matrix (Bluetooth 5.3, 32H Playback, IPX5 Rating, Smart Touch).
     - Color/Edition selector (Matte Black, Lunar White) with active visual states.
     - **Live WhatsApp Message Preview Box**: Real-time dynamically generated WhatsApp message text containing product name, selected color, price, product URL, and custom delivery notes.
     - **"Order on WhatsApp Now" Action**: Triggers WhatsApp link (`https://wa.me/8801700123456?text=...`) and opens the simulated in-app order completion modal.
     - Delivery speed & charges breakdown (Dhaka City ৳60 vs Outside Dhaka ৳120).
     - Shareable product link copy button with instant toast.
   - **Tabbed Information**: Product Details, Customer Reviews (128 verified ratings with breakdown), and How WhatsApp Ordering Works.
   - **Related Products Carousel / Grid**: 3 complementary products with instant WhatsApp ordering.

3. **Admin Portal Login**:
   - Centered aesthetic authentication card with DokanChat branding and green WhatsApp theme.
   - 1-click **Auto-fill Demo Credentials** (`admin` / `password`).
   - Email/Username and Password inputs with password reveal toggle.
   - "Remember this device for 30 days" checkbox.
   - Clear pathway back to public storefront.

4. **DokanChat Admin Panel (`Product Catalog Management`)**:
   - **Sidebar Navigation**: Orders Queue, Product Catalog (active), WhatsApp Setup, and quick link to Go to Storefront.
   - **Top Header**: DokanChat Commerce Control header with live merchant phone indicator and profile badge.
   - **KPI Metrics Bar**: Total Products (active count), In Stock Ready, Low / Out of Stock, and Storefront Status (Online 🟢).
   - **Control Bar**: Real-time search by name/SKU, category dropdown filter, "Export List" (CSV download), and "Columns" toggle.
   - **Delete Confirmation Banner**: Replicates the reference's collapsible alert prompt with "Keep Product" and "Yes, Delete" actions.
   - **Products Data Table**: High-density table with product thumbnail, title, SKU, category tag, price in BDT (৳), stock status pill, WhatsApp inquiry counter, and action buttons (view in store, edit modal, delete).
   - **Add / Edit Product Modal**:
     - Product Name input with preview guidance.
     - Dual-column Price in BDT (৳) & Category selector.
     - Image file uploader with drag-and-drop zone and image preview.
     - Product Description textarea.
     - Stock Availability toggle switch (instant sync to Out of Stock).
     - Cancel and "Save & Publish to Store" buttons.
   - **Orders Queue View**: List of received customer WhatsApp orders with statuses (New Inquiry, Confirmed, Shipped, Delivered) and quick status updates.
   - **WhatsApp Setup View**: Merchant settings to customize WhatsApp store phone number, pre-filled greeting message template, and delivery fee defaults.

### Visual Identity & Design System

- **Color Palette**:
  - Primary Brand Green: `#25D366` / `#006D2F` (WhatsApp brand emerald green)
  - Surface Backgrounds: `#FAF8FF` / `#FFFFFF` (clean light neutral canvas)
  - Structural Borders & Containers: `#EAEDFF` / `#DAE2FD` / `#E2E7FF`
  - High-Contrast Text: `#131B2E` (deep obsidian for sharp typographic hierarchy)
  - Error / Destructive: `#BA1A1A` / `#FFDAD6`
- **Typography**: `Plus Jakarta Sans` for titles and bold branding paired with `Inter` / `DM Sans` for body copy, and `tabular-nums` for all BDT pricing and metrics.
- **Imagery**: Real high-definition photography preserved from the provided reference HTML and assets for earbuds, leather wallets, ambient lamps, memory foam cushions, mechanical keyboards, and thermal bottles.

---

## 3. Key Product Decisions & Trade-Offs

- **Synchronized Client-Side Storage**:
  - *Decision*: Store catalog, orders, and configuration in a reactive browser `localStorage` engine with default catalog seeding.
  - *Why*: Gives merchants an immediate, zero-latency experience where edits in the Admin Panel immediately reflect in the Storefront and vice versa.
- **Hybrid WhatsApp Action**:
  - *Decision*: Clicking "Order on WhatsApp" opens both the real `wa.me` external chat link and a polished in-app WhatsApp order simulator with interactive confirmation steps.
  - *Why*: Allows reviewers and evaluators to experience the full purchasing lifecycle inside the preview iframe while maintaining 100% production-ready external WhatsApp redirection.
- **Convenient Environment Switcher**:
  - *Decision*: An elegant floating top pill allows switching seamlessly between Customer Storefront, Product Detail Page, Admin Login, and Admin Panel without getting trapped in login states.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                         Top Preview Nav Switcher                       │
│           [Storefront Home]  [Product Detail]  [Admin Console]         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
┌─────────────────────────────┐                         ┌─────────────────────────────┐
│    Customer Storefront      │                         │     DokanChat Admin         │
│  - Hero & WhatsApp Preview  │                         │  - Admin Login (Auto-fill)  │
│  - 3-Step Ordering Guide    │                         │  - Catalog Management Table │
│  - Product Grid & Filtering │                         │  - Add / Edit Product Modal │
│  - Product Detail View      │                         │  - Orders Queue & Statuses  │
│  - Live WhatsApp Generator  │                         │  - WhatsApp & Store Settings│
└──────────────┬──────────────┘                         └──────────────┬──────────────┘
               │                                                       │
               └───────────────────────┬───────────────────────────────┘
                                       ▼
                       ┌───────────────────────────────┐
                       │   Local Storage State Store   │
                       │  - Products Catalog (14 items)│
                       │  - Customer Orders Queue      │
                       │  - WhatsApp & Store Config    │
                       │  - Reactive Event Dispatch    │
                       └───────────────────────────────┘
```

### Data Entities & Schema

1. **Product**:
   - `id`: string
   - `name`: string
   - `sku`: string
   - `category`: 'electronics' | 'fashion' | 'home' | 'accessories'
   - `priceBDT`: number
   - `originalPriceBDT`?: number
   - `inStock`: boolean
   - `stockQuantity`: number
   - `inquiriesCount`: number
   - `image`: string
   - `thumbnails`?: string[]
   - `description`: string
   - `specs`?: { label: string; value: string }[]
   - `colors`?: { name: string; available: boolean; hex: string }[]
   - `rating`: number
   - `reviewsCount`: number
   - `isTrending`?: boolean
   - `isBestseller`?: boolean

2. **OrderInquiry**:
   - `id`: string
   - `productId`: string
   - `productName`: string
   - `customerName`?: string
   - `customerPhone`?: string
   - `district`: 'dhaka' | 'outside'
   - `colorSelected`?: string
   - `totalAmountBDT`: number
   - `deliveryChargeBDT`: number
   - `timestamp`: string
   - `status`: 'new' | 'confirmed' | 'shipped' | 'delivered'
   - `message`: string

3. **StoreSettings**:
   - `whatsappNumber`: string (`+880 1700-123456`)
   - `storeName`: string (`Universal Shop`)
   - `dhakaDeliveryCharge`: number (`60`)
   - `outsideDeliveryCharge`: number (`120`)
   - `isStoreOnline`: boolean (`true`)

---

## 5. Verification & Completion Criteria

- [ ] Storefront Home renders matching Image 4 with accurate typography, filters, and product cards.
- [ ] Product Detail Page renders matching Image 3 with thumbnail switcher, specs, live WhatsApp preview, and color options.
- [ ] Admin Login screen renders matching Image 2 with working 1-click test auto-fill.
- [ ] Admin Product Catalog renders matching Image 1 with real-time metrics, search/filter, delete confirmation, and Add Product modal.
- [ ] Adding/editing/deleting a product in the admin panel instantly reflects on the storefront.
- [ ] "Order on WhatsApp" formats correct BDT prices, product titles, and handles opening WhatsApp with interactive simulated receipt confirmation.
- [ ] Verified with `compile_applet` and tested for zero runtime console errors or broken links.
