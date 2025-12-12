import { EtsyListing, EtsyListingsResponse, EtsyShop, Product } from './etsy-types';
import { getValidAccessToken } from './oauth-storage-serverless';

const ETSY_API_BASE = 'https://openapi.etsy.com/v3';
const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID || '';

/**
 * Get authorization headers for Etsy API using OAuth
 */
async function getEtsyHeaders(): Promise<HeadersInit> {
  const accessToken = await getValidAccessToken();
  const ETSY_API_KEY = process.env.ETSY_API_KEY;
  
  if (!accessToken) {
    throw new Error('No valid OAuth token available. Please authenticate via /admin/oauth');
  }

  if (!ETSY_API_KEY) {
    throw new Error('ETSY_API_KEY environment variable not set');
  }

  return {
    'Authorization': `Bearer ${accessToken}`,
    'x-api-key': ETSY_API_KEY,
    'Content-Type': 'application/json',
  };
}

/**
 * Fetch active listings from Etsy shop using OAuth
 */
export async function getEtsyListings(limit: number = 100): Promise<EtsyListing[]> {
  if (!ETSY_SHOP_ID) {
    // Shop ID not configured - use fallback data
    return [];
  }

  try {
    console.log('🔗 Getting Etsy headers...');
    const headers = await getEtsyHeaders();
    
    const url = `${ETSY_API_BASE}/application/shops/${ETSY_SHOP_ID}/listings/active?limit=${limit}&includes=images`;
    console.log('📡 Fetching from:', url);
    
    const response = await fetch(url, {
      headers,
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Etsy API Error:', response.status, errorText);
      
      if (response.status === 401) {
        console.error('OAuth token expired or invalid. Please re-authenticate via /admin/oauth');
      }
      // Silently fail for other errors - fallback will be used
      return [];
    }

    const data: EtsyListingsResponse = await response.json();
    console.log('✅ Etsy API Success - Found listings:', data.results?.length || 0);
    
    if (data.results && data.results.length > 0) {
      const sample = data.results[0];
      console.log('📝 Sample listing:', {
        id: sample.listing_id,
        title: sample.title,
        state: sample.state,
        images: sample.images?.length || 0,
        main_image: sample.images?.[0]?.url_570xN,
      });
    }
    
    return data.results || [];
  } catch (error) {
    if (error instanceof Error && error.message.includes('OAuth')) {
      console.error('OAuth error:', error.message);
    }
    // Silently fail and return empty array - fallback will be used
    return [];
  }
}

/**
 * Fetch shop info from Etsy using OAuth
 */
export async function getEtsyShop(): Promise<EtsyShop | null> {
  if (!ETSY_SHOP_ID) {
    // Shop ID not configured
    return null;
  }

  try {
    const headers = await getEtsyHeaders();
    
    const response = await fetch(
      `${ETSY_API_BASE}/application/shops/${ETSY_SHOP_ID}`,
      {
        headers,
        next: {
          revalidate: 86400, // Cache for 24 hours
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.error('OAuth token expired or invalid. Please re-authenticate via /admin/oauth');
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('OAuth')) {
      console.error('OAuth error:', error.message);
    }
    // Silently fail - return null for fallback handling
    return null;
  }
}

/**
 * Fetch a single listing by ID from Etsy using OAuth
 */
export async function getEtsyListingById(listingId: string): Promise<EtsyListing | null> {
  if (!ETSY_SHOP_ID) {
    return null;
  }

  try {
    const headers = await getEtsyHeaders();
    
    const response = await fetch(
      `${ETSY_API_BASE}/application/listings/${listingId}?includes=images`,
      {
        headers,
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.error('OAuth token expired or invalid. Please re-authenticate via /admin/oauth');
      }
      return null;
    }

    const data = await response.json();
    return data.results && data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('OAuth')) {
      console.error('OAuth error:', error.message);
    }
    return null;
  }
}

/**
 * Map Etsy listing to our internal Product type
 */
export function mapEtsyListingToProduct(listing: EtsyListing): Product {
  const price = listing.price ? listing.price.amount / listing.price.divisor : 0;
  const mainImage = listing.images?.[0]?.url_570xN || '/placeholder-image.jpg';
  const allImages = listing.images?.map(img => img.url_fullxfull) || [mainImage];
  
  console.log(`🖼️  Mapping product "${listing.title}":`, {
    main_image: mainImage,
    total_images: allImages.length,
    domain_check: mainImage.includes('etsystatic.com') ? '✅ Etsy domain' : '⚠️  Non-Etsy domain'
  });

  // Determine category from tags or materials
  let category = 'bracelets'; // default
  const tags = (listing.tags || []).map(t => t.toLowerCase());
  
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
  const isNew = listing.created_timestamp ? listing.created_timestamp * 1000 > thirtyDaysAgo : false;

  // Check if it's a bestseller (based on favorites or views)
  const isBestseller = (listing.num_favorers || 0) > 10;

  return {
    id: listing.listing_id.toString(),
    name: listing.title,
    image: mainImage,
    images: allImages,
    category: category,
    description: listing.description || '',
    isNew: isNew,
    inStock: (listing.quantity || 0) > 0 && listing.state === 'active',
    etsyUrl: listing.url,
    etsyListingId: listing.listing_id,
    tags: listing.tags || [],
    isBestseller: isBestseller,
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

/**
 * Check if we have OAuth authentication available
 */
export async function hasEtsyAuthentication(): Promise<boolean> {
  try {
    const accessToken = await getValidAccessToken();
    return !!accessToken;
  } catch {
    return false;
  }
}