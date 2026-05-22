# PRD — Frontend: ansania
**Versi:** 1.0.0  
**Framework:** Next.js 16.2.x (latest: 16.2.6)  
**Language:** TypeScript  
**Styling:** Tailwind CSS  
**State Management:** Zustand  
**Backend API:** `https://api.ansania.com/api/v1`  
**Node.js:** 20+ (Next.js 16 dropped support untuk Node.js 18)

---

## Daftar Isi
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Environment Variables](#4-environment-variables)
5. [Routing & Pages](#5-routing--pages)
6. [Layouts](#6-layouts)
7. [State Management (Zustand)](#7-state-management-zustand)
8. [API Layer](#8-api-layer)
9. [Auth Flow](#9-auth-flow)
10. [Caching Strategy](#10-caching-strategy)
11. [Halaman Customer](#11-halaman-customer)
12. [Halaman Admin](#12-halaman-admin)
13. [Komponen Shared](#13-komponen-shared)
14. [SEO & Metadata](#14-seo--metadata)
15. [Performance](#15-performance)
16. [Integrasi Midtrans (Frontend)](#16-integrasi-midtrans-frontend)

---

## 1. Project Overview

ansania adalah e-commerce fashion/tekstil Indonesia. Frontend ini melayani dua persona:

**Customer** — browsing produk, checkout, tracking order, review.  
**Admin** — kelola produk, order, banner, voucher, setting toko.

Frontend berkomunikasi 100% dengan backend API (`ansania-api`). Tidak ada direct DB access dari frontend.

---

## 2. Tech Stack

| Komponen | Pilihan | Keterangan |
|---|---|---|
| Framework | Next.js 16.2.x | App Router, Server Components |
| Language | TypeScript 5 | strict mode on |
| Bundler | Turbopack | Default di 16.x — tidak perlu konfigurasi tambahan |
| Styling | Tailwind CSS 3 | + `tailwind-merge`, `clsx` |
| UI Components | shadcn/ui | basis komponen, dikustomisasi |
| Icons | Lucide React | |
| State | Zustand | client-side global state |
| Server State | TanStack Query v5 | caching client-side, refetch, optimistic update |
| Forms | React Hook Form + Zod | validasi client-side |
| HTTP Client | Axios | instance terpisah untuk customer & admin |
| Auth | next-auth v5 (Auth.js) | JWT strategy + Google/Facebook provider |
| Image | next/image | optimisasi otomatis |
| Payment | Midtrans Snap.js | load via Script tag |
| Notifications | react-hot-toast | |
| Date | date-fns | format tanggal Bahasa Indonesia |
| Currency | Intl.NumberFormat | format IDR |
| SEO | Next.js Metadata API | generateMetadata per page |
| React | 19.2 | bundled di Next.js 16 — useEffectEvent, Activity, View Transitions |
| React Compiler | 1.0 (opt-in) | aktifkan via `next.config.ts` |

---

## 3. Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (customer)/               # Route group customer (layout customer)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Homepage
│   │   ├── produk/
│   │   │   ├── page.tsx          # Product listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Product detail
│   │   ├── kategori/
│   │   │   └── [slug]/page.tsx
│   │   ├── brand/
│   │   │   └── [slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── pesanan/
│   │   │   ├── page.tsx
│   │   │   └── [orderNumber]/page.tsx
│   │   ├── akun/
│   │   │   ├── layout.tsx
│   │   │   ├── profil/page.tsx
│   │   │   ├── alamat/page.tsx
│   │   │   ├── wishlist/page.tsx
│   │   │   └── notifikasi/page.tsx
│   │   ├── flash-sale/page.tsx
│   │   └── [slug]/page.tsx       # Landing pages dinamis
│   ├── (auth)/                   # Route group auth (layout minimal)
│   │   ├── layout.tsx
│   │   ├── masuk/page.tsx
│   │   ├── daftar/page.tsx
│   │   ├── lupa-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verifikasi-email/page.tsx
│   ├── admin/                    # Admin panel (layout terpisah)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── produk/
│   │   │   ├── page.tsx
│   │   │   ├── tambah/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── kategori/
│   │   ├── brand/
│   │   ├── pesanan/
│   │   ├── voucher/
│   │   ├── flash-sale/
│   │   ├── ulasan/
│   │   ├── banner/
│   │   ├── pengaturan/
│   │   ├── landing-pages/
│   │   ├── redirect/
│   │   └── jubelio/
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx
│   ├── error.tsx
│   └── global-error.tsx
├── components/
│   ├── ui/                       # shadcn/ui — JANGAN edit langsung
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── AccountSidebar.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductImages.tsx
│   │   ├── VariantSelector.tsx
│   │   ├── PriceDisplay.tsx
│   │   ├── StockBadge.tsx
│   │   ├── FlashSaleBadge.tsx
│   │   ├── RatingSummary.tsx
│   │   └── ReviewList.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── AddressSelector.tsx
│   │   ├── ShippingSelector.tsx
│   │   ├── VoucherInput.tsx
│   │   ├── OrderSummary.tsx
│   │   └── PaymentButton.tsx
│   ├── order/
│   │   ├── OrderCard.tsx
│   │   ├── OrderStatusBadge.tsx
│   │   ├── OrderTimeline.tsx
│   │   └── ReviewForm.tsx
│   ├── admin/
│   │   ├── DataTable.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── StatCard.tsx
│   └── shared/
│       ├── EmptyState.tsx
│       ├── LoadingSpinner.tsx
│       ├── Pagination.tsx
│       ├── SearchBar.tsx
│       ├── ConfirmDialog.tsx
│       └── NotificationBell.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useWishlist.ts
│   ├── useProducts.ts
│   ├── useOrders.ts
│   ├── useNotifications.ts
│   └── useDebounce.ts
├── lib/
│   ├── api/
│   │   ├── client.ts            # axios instance customer
│   │   ├── adminClient.ts       # axios instance admin
│   │   ├── auth.api.ts
│   │   ├── products.api.ts
│   │   ├── cart.api.ts
│   │   ├── orders.api.ts
│   │   ├── shipping.api.ts
│   │   ├── payments.api.ts
│   │   ├── reviews.api.ts
│   │   ├── notifications.api.ts
│   │   └── admin/
│   ├── auth.ts                  # next-auth config
│   ├── queryClient.ts           # TanStack Query client
│   └── utils.ts                 # cn(), formatCurrency(), formatDate()
├── stores/
│   ├── cartStore.ts
│   ├── wishlistStore.ts
│   └── uiStore.ts
├── types/
│   ├── api.types.ts
│   ├── product.types.ts
│   ├── order.types.ts
│   ├── user.types.ts
│   └── index.ts
├── constants/
│   ├── routes.ts
│   ├── queryKeys.ts
│   └── config.ts
└── proxy.ts                     # Next.js 16 — GANTI middleware.ts
```

---

## 4. Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=https://ansania.com
NEXT_PUBLIC_API_URL=https://api.ansania.com/api/v1

# next-auth
NEXTAUTH_URL=https://ansania.com
NEXTAUTH_SECRET=min_32_chars_random_secret

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# Midtrans (hanya CLIENT KEY — server key tidak boleh di frontend)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_MIDTRANS_MODE=sandbox
```

> **Aturan:** variabel yang diakses di browser WAJIB prefix `NEXT_PUBLIC_`.  
> `serverRuntimeConfig` / `publicRuntimeConfig` sudah **dihapus** di Next.js 16 — gunakan env vars biasa.

---

## 5. Routing & Pages

### `proxy.ts` (pengganti `middleware.ts`)

> Next.js 16 memperkenalkan `proxy.ts` sebagai pengganti `middleware.ts`. Buat file ini di root `src/`.

```ts
// src/proxy.ts — bukan middleware.ts lagi
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protected: wajib login
  const protectedPaths = ['/checkout', '/pesanan', '/akun'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/masuk', req.url));
  }

  // Admin only
  if (pathname.startsWith('/admin')) {
    if (!session || session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Redirect jika sudah login
  const authPaths = ['/masuk', '/daftar'];
  if (authPaths.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Route Constants (`constants/routes.ts`)

```ts
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/produk',
  PRODUCT: (slug: string) => `/produk/${slug}`,
  CATEGORY: (slug: string) => `/kategori/${slug}`,
  BRAND: (slug: string) => `/brand/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/pesanan',
  ORDER: (orderNumber: string) => `/pesanan/${orderNumber}`,
  FLASH_SALE: '/flash-sale',
  AUTH: {
    LOGIN: '/masuk',
    REGISTER: '/daftar',
    FORGOT_PASSWORD: '/lupa-password',
  },
  ACCOUNT: {
    PROFILE: '/akun/profil',
    ADDRESSES: '/akun/alamat',
    WISHLIST: '/akun/wishlist',
    NOTIFICATIONS: '/akun/notifikasi',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/produk',
    PRODUCT_ADD: '/admin/produk/tambah',
    PRODUCT_EDIT: (id: number) => `/admin/produk/${id}`,
    ORDERS: '/admin/pesanan',
    VOUCHERS: '/admin/voucher',
    BANNERS: '/admin/banner',
    SETTINGS: '/admin/pengaturan',
    JUBELIO: '/admin/jubelio',
  },
} as const;
```

---

## 6. Layouts

### Root Layout (`app/layout.tsx`)
- `<html lang="id">`
- Load font (Geist — default Next.js 16)
- `QueryClientProvider`
- `SessionProvider` (next-auth)
- `<Toaster />` (react-hot-toast)

### Customer Layout (`app/(customer)/layout.tsx`)
- `<Navbar />` — logo, search bar, cart icon (badge), notifikasi bell, user menu
- `<main>` — konten
- `<Footer />` — links, social media, info toko

### Auth Layout — minimal, hanya logo + card form

### Admin Layout — sidebar + header + guard role admin

---

## 7. State Management (Zustand)

### `cartStore.ts`
```ts
interface CartStore {
  items: CartItem[];
  cartId: number | null;
  isOpen: boolean;
  setCart: (cart: Cart) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (itemId: number, qty: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalItems: number;
  totalPrice: number;
}
```

### `wishlistStore.ts`
```ts
interface WishlistStore {
  productIds: number[];
  toggle: (productId: number, variantId?: number) => Promise<void>;
  init: (items: WishlistItem[]) => void;
}
```

---

## 8. API Layer

### Axios Instance (`lib/api/client.ts`)

```ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    if (error.response?.status === 401) {
      // trigger refresh atau signOut
    }
    return Promise.reject(error.response?.data || error);
  }
);
```

---

## 9. Auth Flow

**Strategy:** JWT session via next-auth v5.  
**Providers:** Credentials (email+password), Google, Facebook.

**Session shape:**
```ts
interface Session {
  user: {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    avatar_url: string | null;
  };
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
}
```

**Token Refresh:** Di callback `jwt` next-auth, decode access token, cek `exp`. Jika expired → call `POST /auth/refresh` → update session.

---

## 10. Caching Strategy

> **BREAKING CHANGE Next.js 16:** Semua route sekarang **dynamic by default**. Tidak ada implicit caching. Caching harus eksplisit menggunakan direktif `"use cache"`.

### `"use cache"` Directive

Pengganti `fetch()` dengan `next: { revalidate: X }`. Digunakan di Server Component atau async function.

```ts
// ✅ Next.js 16 — eksplisit opt-in caching
import { cacheLife, cacheTag } from 'next/cache';

async function getCategories() {
  'use cache';
  cacheLife('hours');        // preset: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'max'
  cacheTag('categories');    // untuk on-demand revalidation

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  return res.json();
}

// Custom TTL
async function getProduct(slug: string) {
  'use cache';
  cacheLife({ revalidate: 60, expire: 3600 }); // stale setelah 60s, expire setelah 1 jam
  cacheTag(`product-${slug}`);

  const res = await fetch(`${API_URL}/products/${slug}`);
  return res.json();
}
```

### `cacheLife` Presets (default Next.js)
| Preset | `stale` | `revalidate` | `expire` |
|---|---|---|---|
| `'seconds'` | 0 | 1 | 60 |
| `'minutes'` | 0 | 60 | 3600 |
| `'hours'` | 0 | 3600 | 86400 |
| `'days'` | 0 | 86400 | 604800 |

### Strategi Per Halaman
| Halaman | Cache Strategy |
|---|---|
| Homepage (banner, produk featured) | `cacheLife('minutes')` |
| Product listing | `cacheLife('minutes')` |
| Product detail | `cacheLife({ revalidate: 60, expire: 3600 })` |
| Kategori & brand | `cacheLife('hours')` |
| Order, akun, checkout | **No cache** — fetch setiap render (dynamic) |

### On-Demand Revalidation (Admin)
Saat admin update produk/banner/kategori, call `revalidateTag('product-slug')` dari Server Action.

```ts
// Server Action di admin form
'use server';
import { revalidateTag } from 'next/cache';

export async function updateProduct(id: number, data: ProductData) {
  await productsApi.update(id, data);
  revalidateTag(`product-${data.slug}`);
  revalidateTag('products-list');
}
```

---

## 11. Halaman Customer

### Homepage (`/`)

**Sections:**
1. Hero Banner — `GET /banners?position=homepage_hero`
2. Flash Sale Strip — jika ada flash sale aktif + countdown timer
3. Kategori Grid — `GET /categories`
4. Produk Unggulan — `GET /products?is_featured=true&limit=8`
5. Mid Banner — `GET /banners?position=mid_banner`
6. Produk Terbaru — `GET /products?sort=newest&limit=8`

**Rendering:** Server Component dengan `"use cache"` + `cacheLife('minutes')`.

---

### Product Listing (`/produk`)

**Fitur:**
- Filter sidebar: kategori, brand, range harga, rating minimum
- Sort: Terbaru, Harga Terendah, Harga Tertinggi, Terpopuler
- Search (sync URL query params `?q=...`)
- Pagination
- Grid: 2 kolom mobile, 3 tablet, 4 desktop

**URL state:** filter disimpan di URL query params.  
**Rendering:** Server Component untuk initial render, filter update via TanStack Query client-side.

---

### Product Detail (`/produk/[slug]`)

**Sections:**
1. Product Images — gallery + zoom + thumbnail strip
2. Info — nama, brand, rating summary
3. Price Display — harga, harga coret, flash sale badge + countdown
4. Variant Selector — warna & ukuran; update harga/stok/gambar saat dipilih
5. Quantity Selector — min 1, max = stock
6. CTA — "Tambah ke Keranjang" + "Beli Sekarang"
7. Wishlist toggle button
8. Deskripsi & Spesifikasi (tabs)
9. Ulasan — filter bintang, list review + foto

**Logic:**
- Stok = 0 → disable tombol, tampilkan "Stok Habis"
- Stok ≤ 5 → tampilkan "Stok Terbatas"
- Flash sale aktif → tampilkan harga sale + countdown

**Rendering:** Server Component + `"use cache"` dengan `cacheTag('product-{slug}')`.

---

### Cart (`/cart`)

- List item — gambar, nama, variant, harga, qty stepper, hapus
- CartSummary — subtotal, estimasi
- "Lanjut ke Checkout"

**Cart Drawer:** muncul dari kanan, mini version cart. Guest cart: `session_id` di `localStorage`.

---

### Checkout (`/checkout`)

**Sections linear:**
1. Alamat Pengiriman — pilih dari list + modal tambah baru
2. Pengiriman — pilih kurir & layanan, tampilkan ETD & harga
3. Voucher — input code → validasi → tampilkan diskon
4. Ringkasan & Bayar — total + tombol → trigger Midtrans Snap

**Client Component** karena sangat interaktif. State checkout di React state lokal.

---

### Order List & Detail, Akun, Flash Sale

Sama dengan versi sebelumnya — lihat bagian 10-12 di versi PRD sebelumnya.

---

## 12. Halaman Admin

Semua Client Component karena interaktif. Guard di `proxy.ts` + layout.

- **Dashboard** — statistik, tabel order terbaru, status sync Jubelio
- **Produk** — DataTable + form tabs (Info | Variant | Gambar | SEO)
- **Order** — list + update status + input resi
- **Voucher & Flash Sale** — CRUD dengan form modal
- **Banner** — drag-to-reorder, upload gambar desktop + mobile
- **Pengaturan** — tabs per group, batch update
- **Jubelio** — trigger sync manual, log history

---

## 13. Komponen Shared

### `PriceDisplay`
```tsx
<PriceDisplay price={150000} comparePrice={200000} flashSalePrice={120000} />
```
Format IDR via `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })`.

### `OrderStatusBadge`
Map status → warna + label Bahasa Indonesia:
- `pending_payment` → yellow → "Menunggu Pembayaran"
- `paid` → blue → "Dibayar"
- `processing` → purple → "Diproses"
- `shipped` → cyan → "Dikirim"
- `delivered` → green → "Selesai"
- `cancelled` → red → "Dibatalkan"
- `refunded` → gray → "Dikembalikan"

### `DataTable` — `@tanstack/react-table`, columns + data + pagination.
### `ImageUpload` — drag & drop, preview, progress, return URL.
### `ConfirmDialog` — modal konfirmasi dengan variant `destructive`.

---

## 14. SEO & Metadata

```ts
// generateMetadata pattern
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug); // cached
  return {
    title: product.meta_title || `${product.name} — ansania`,
    description: product.meta_description || product.short_description,
    openGraph: {
      title: product.name,
      images: [{ url: product.primary_image }],
    },
  };
}
```

**Sitemap** (`app/sitemap.ts`) — homepage + semua produk + kategori + brand.  
**Robots** (`app/robots.ts`) — block `/admin/*`, `/akun/*`, `/pesanan/*`, `/checkout`.

---

## 15. Performance

### Image
- Selalu `next/image` dengan `sizes` yang tepat
- `priority` untuk gambar above the fold

### Streaming & Suspense
- Bungkus setiap section dengan `<Suspense fallback={<Skeleton />}>`
- `loading.tsx` untuk page-level

### Turbopack
Sudah aktif by default di Next.js 16. Tidak perlu `--turbopack` flag.

### Bundle
Dynamic import untuk komponen berat:
```ts
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });
```

### React Compiler (opt-in)
```ts
// next.config.ts
const config: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
};
```
Aktifkan setelah project stabil. Compiler otomatis memoize komponen yang perlu.

---

## 16. Integrasi Midtrans (Frontend)

### Load Snap.js
```tsx
<Script
  src={
    process.env.NEXT_PUBLIC_MIDTRANS_MODE === 'production'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
  }
  data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
  strategy="afterInteractive"
/>
```

### Trigger Payment
```ts
const handlePayment = async () => {
  const order = await createOrder(orderPayload);
  const { snap_token } = await initiatePayment(order.order_id);

  window.snap.pay(snap_token, {
    onSuccess: () => {
      router.push(ROUTES.ORDER(order.order_number));
      toast.success('Pembayaran berhasil!');
    },
    onPending: () => {
      router.push(ROUTES.ORDER(order.order_number));
      toast('Menunggu pembayaran...');
    },
    onError: () => toast.error('Pembayaran gagal. Silakan coba lagi.'),
    onClose: () => toast('Pembayaran dibatalkan.'),
  });
};
```

> Jangan poll status payment dari frontend. Status diupdate via webhook backend → cek status terkini saat user kembali ke halaman order.
