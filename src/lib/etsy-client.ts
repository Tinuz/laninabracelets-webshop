import { EtsyListing, EtsyListingsResponse, EtsyShop, Product } from './etsy-types';

const ETSY_API_BASE = 'https://openapi.etsy.com/v3';
const ETSY_API_KEY = process.env.ETSY_API_KEY || '';
const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID || '';

/**
 * Fetch active listings from Etsy shop
 */
export async function getEtsyListings(limit: number = 100): Promise<EtsyListing[]> {
  if (!ETSY_API_KEY || !ETSY_SHOP_ID) {
    console.warn('Etsy API credentials not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${ETSY_API_BASE}/application/shops/${ETSY_SHOP_ID}/listings/active?limit=${limit}&includes=images`,
      {
        headers: {
          'x-api-key': ETSY_API_KEY,
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Etsy API error: ${response.status} ${response.statusText}`);
    }

    const data: EtsyListingsResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching Etsy listings:', error);
    return [];
  }
}

/**
 * Fetch shop info from Etsy
 */
export async function getEtsyShop(): Promise<EtsyShop | null> {
  if (!ETSY_API_KEY || !ETSY_SHOP_ID) {
    console.warn('Etsy API credentials not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${ETSY_API_BASE}/application/shops/${ETSY_SHOP_ID}`,
      {
        headers: {
          'x-api-key': ETSY_API_KEY,
        },
        next: {
          revalidate: 86400, // Cache for 24 hours
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Etsy API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Etsy shop:', error);
    return null;
  }
}

/**
 * Map Etsy listing to our internal Product type
 */
export function mapEtsyListingToProduct(listing: EtsyListing): Product {
  const price = listing.price.amount / listing.price.divisor;
  const mainImage = listing.images?.[0]?.url_570xN || '/placeholder-image.jpg';
  const allImages = listing.images?.map(img => img.url_fullxfull) || [mainImage];

  // Determine category from tags or materials
  let category = 'bracelets'; // default
  const tags = listing.tags.map(t => t.toLowerCase());
  
  if (tags.some(t => t.includes('ring'))) {
    category = 'rings';
  } else if (tags.some(t => t.includes('necklace') || t.includes('ketting'))) {
    category = 'necklaces';
  } else if (tags.some(t => t.includes('earring') || t.includes('oorbel'))) {
    category = 'earrings';
  } else if (tags.some(t => t.includes('bracelet') || t.includes('armband'))) {
    category = 'bracelets';
  }

  // Check if listing is new (created in last 30 days)
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const isNew = listing.created_timestamp * 1000 > thirtyDaysAgo;

  return {
    id: listing.listing_id.toString(),
    name: listing.title,
    price: price,
    currency: listing.price.currency_code,
    image: mainImage,
    images: allImages,
    category: category,
    description: listing.description,
    isNew: isNew,
    inStock: listing.quantity > 0 && listing.state === 'active',
    quantity: listing.quantity,
    etsyUrl: listing.url,
    etsyListingId: listing.listing_id,
    tags: listing.tags,
  };
}

/**
 * Get all products from Etsy mapped to our Product type
 */
export async function getProducts(): Promise<Product[]> {
  const listings = await getEtsyListings();
  return listings.map(mapEtsyListingToProduct);
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

