# TutaSnack — Sales Tracker

Aplikasi point-of-sale dan tracking keuangan untuk usaha snack, dibangun dengan **Nuxt 3**, **Tailwind CSS**, dan **shadcn-style components**. Siap deploy ke **Cloudflare Pages**.

## Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| **Nuxt 3** | Framework Vue 3 universal (SSR/SSG/SPA) |
| **Tailwind CSS 3** | Utility-first styling |
| **shadcn-ui** | Component primitives (Button, Card, Input, Badge, dll) |
| **Pinia** | State management |
| **Nitro** | Server engine (otomatis bareng Nuxt) |
| **Cloudflare Pages** | Deployment & hosting |

## Menu / Halaman

| Halaman | Deskripsi |
|---------|-----------|
| `/login` | Sign in |
| `/register` | Registrasi akun baru |
| `/dashboard` | Overview: stat harian, transaksi terbaru, quick actions |
| `/sales-income` | Riwayat pendapatan per periode |
| `/sales-tracker` | Form input transaksi penjualan baru |
| `/expense-tracker` | Catat & lihat riwayat pengeluaran |
| `/management-users` | Kelola tim & role pengguna |

## Setup

```bash
# clone & masuk folder
cd tutasnack-frontend

# install dependencies
npm install

# jalankan development server
npm run dev
```

Buka `http://localhost:3000` di browser.

## Scripts

| Perintah | Kegunaan |
|----------|----------|
| `npm run dev` | Development server dengan HMR |
| `npm run build` | Build production ke `.output/` |
| `npm run generate` | Static site generation |
| `npm run preview` | Preview build lokal |
| `npm run cf-preview` | Preview Cloudflare Pages lokal (`wrangler pages dev`) |
| `npm run cf-deploy` | Build + deploy ke Cloudflare Pages |

## Deploy ke Cloudflare Pages

```bash
# 1. Build production
npm run build

# 2. Deploy
npm run cf-deploy

# Atau manual:
npx wrangler pages deploy .output/public --project-name=tutasnack
```

Pastikan sudah login ke wrangler:
```bash
npx wrangler login
```

Konfigurasi Cloudflare ada di `wrangler.toml`.

## Project Structure

```
├── app.vx                  # Entry point Vue
├── nuxt.config.ts          # Konfigurasi Nuxt (preset: cloudflare-pages)
├── tailwind.config.ts      # Konfigurasi Tailwind + CSS variables shadcn
├── wrangler.toml           # Konfigurasi Cloudflare Pages
│
├── assets/
│   └── css/
│       └── main.css        # Global styles + CSS variables (light/dark)
│
├── components/             # Vue components
│   ├── ui/                 # shadcn-style components (Button, Card, Input, dll)
│   └── AppSidebar.vue      # Sidebar navigasi
│
├── layouts/
│   ├── default.vue         # Layout utama dengan sidebar + header
│   └── auth.vue            # Layout minimal untuk halaman auth
│
├── pages/                  # File-based routing
│   ├── index.vue           # Redirect → /dashboard
│   ├── login.vue
│   ├── register.vue
│   ├── dashboard.vue
│   ├── sales-income.vue
│   ├── sales-tracker.vue
│   ├── expense-tracker.vue
│   └── management-users.vue
│
├── composables/            # Auto-imported composables (useNavigation)
├── utils/                  # Utility functions (cn helper)
├── types/                  # TypeScript type definitions
├── stores/                 # Pinia stores
├── server/                 # Nitro API routes (backend)
└── shared/                 # Shared utilities, types, composables (Nuxt 4 ready)
```
