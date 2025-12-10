# LaNinaBracelets Webshop

A modern, luxury e-commerce showcase for jewelry, featuring **Etsy integration**, responsive design, product filtering, and elegant animations. 

🎯 **Products are automatically synced from your Etsy shop** - visitors are redirected to Etsy for secure checkout!

## Features

- **🛍️ Etsy Integration**: Automatic product sync from your Etsy shop
- **🔗 Direct Etsy Checkout**: "Buy on Etsy" buttons redirect to Etsy for secure payment
- **🏠 Home Page**: Immersive hero section, featured categories, and curated products
- **📦 Collection**: Filterable and sortable product grid with live Etsy data
- **🔍 Product Detail**: Detailed view with gallery, Etsy badges, and related items
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **✨ Animations**: Smooth page transitions and micro-interactions using Framer Motion
- **⚡ Performance**: Server-side rendering with automatic caching

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Etsy Open API v3**
- **Framer Motion**
- **Lucide React Icons**

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Etsy API
See **[ETSY_SETUP.md](./ETSY_SETUP.md)** for detailed setup instructions.

Quick setup:
1. Create `.env.local` file
2. Add your Etsy credentials:
```env
ETSY_API_KEY=your_api_key
ETSY_SHARED_SECRET=your_shared_secret
ETSY_SHOP_ID=your_shop_id
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Etsy Integration

This webshop automatically syncs products from your Etsy shop:
- ✅ Real-time product data from Etsy API
- ✅ Automatic price & inventory sync
- ✅ "Buy on Etsy" buttons redirect to Etsy checkout
- ✅ Fallback to demo data if API is not configured

**See [ETSY_SETUP.md](./ETSY_SETUP.md) for complete setup guide.**

## Customization

The component uses Tailwind CSS variables for theming. You can adjust the colors in the `src/Component.tsx` file's Tailwind configuration.
