# 🚀 Vercel Deployment Setup Guide

## Environment Variables Required

### **In Vercel Dashboard:**

Ga naar: **Project Settings → Environment Variables**

### **Add These Variables:**

```bash
# Etsy API Configuration
ETSY_API_KEY=rg4tmn3xzesq2a5vczf0os1w
ETSY_SHARED_SECRET=zws4h3pm4j  
ETSY_SHOP_ID=63450436

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.laninabracelets.com
```

### **Optional Variables:**
```bash
# Already configured in code, no need to add:
# GA_MEASUREMENT_ID=G-9VX19LKH01
```

---

## 🎯 **Deployment Steps:**

### **1. Environment Variables Setup**
1. Go to Vercel Dashboard
2. Select your project 
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. Set Environment to: **Production, Preview, Development**

### **2. Deploy**
1. **Push** changes to GitHub (already done ✅)
2. **Vercel** will auto-deploy from main branch
3. **Build** should succeed with TypeScript fixes ✅

### **3. Verify Deployment**
1. Check build logs are successful
2. Visit deployed URL
3. Test functionality:
   - ✅ Home page loads
   - ✅ Collection page works
   - ✅ Product filtering (New/Bestsellers)
   - ✅ About page displays
   - ✅ Google Analytics tracking

---

## 🔧 **Troubleshooting:**

### **Build Errors:**
- ✅ **TypeScript issues**: Fixed in sitemap.ts
- ✅ **Next.js version**: Using stable 15.5.7
- ✅ **Environment variables**: Document above

### **Runtime Issues:**
- **Etsy API**: Will work when API approval comes through
- **Fallback data**: Local products display meanwhile
- **Analytics**: Already tracking with G-9VX19LKH01

---

## 🎉 **Expected Result:**

**Fully functional La Nina Bracelets website with:**
- ✅ SEO optimized (meta tags, structured data)
- ✅ Google Analytics tracking  
- ✅ PWA features (installable)
- ✅ Performance optimized
- ✅ Mobile responsive
- ✅ Professional design

**Ready for customers! 💎**
