import { getProducts as getEtsyProducts, getProductById as getEtsyProductById } from './etsy-client';
import { PRODUCTS as FALLBACK_PRODUCTS } from './data';
import { Product } from './data';

/**
 * Get all products - tries Etsy first, falls back to dummy data
 */
export async function getProducts(): Promise<Product[]> {
  // Try to fetch from Etsy
  try {
    const etsyProducts = await getEtsyProducts();
    
    // If we have Etsy products, use them
    if (etsyProducts && etsyProducts.length > 0) {
      return etsyProducts;
    }
  } catch (error) {
    // Silently fall back to local data
  }
  
  // Fallback to local data - no logging needed
  return FALLBACK_PRODUCTS;
}

/**
 * Get product by ID - tries Etsy first, falls back to dummy data
 */
export async function getProductById(id: string): Promise<Product | null> {
  // Try to fetch from Etsy
  try {
    const etsyProduct = await getEtsyProductById(id);
    if (etsyProduct) {
      return etsyProduct;
    }
  } catch (error) {
    // Silently fall back to local data
  }
  
  // Fallback to dummy data
  return FALLBACK_PRODUCTS.find(p => p.id === id) || null;
}

/**
 * Check if we're using Etsy data or fallback
 */
export async function isUsingEtsyData(): Promise<boolean> {
  const apiKey = process.env.ETSY_API_KEY;
  const shopId = process.env.ETSY_SHOP_ID;
  return !!(apiKey && shopId);
}

