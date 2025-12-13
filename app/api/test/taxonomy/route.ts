import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/src/lib/oauth-storage-redis';

const ETSY_API_BASE = 'https://openapi.etsy.com/v3';
const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID || '';

/**
 * Test endpoint to analyze Etsy taxonomy mapping
 * Uses SellerTaxonomy API: https://developer.etsy.com/documentation/reference/#tag/SellerTaxonomy
 */
export async function GET() {
  try {
    // Step 1: Get OAuth headers
    const accessToken = await getValidAccessToken();
    const ETSY_API_KEY = process.env.ETSY_API_KEY;

    if (!accessToken) {
      return NextResponse.json({
        error: 'OAuth not authenticated',
        message: 'Please authenticate via /admin/oauth first',
        authenticated: false,
      }, { status: 401 });
    }

    if (!ETSY_API_KEY || !ETSY_SHOP_ID) {
      return NextResponse.json({
        error: 'Configuration missing',
        message: 'ETSY_API_KEY or ETSY_SHOP_ID not configured',
      }, { status: 500 });
    }

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': ETSY_API_KEY,
      'Content-Type': 'application/json',
    };

    // Step 2: Fetch sample listing
    console.log('📦 Fetching sample listing from shop...');
    
    const listingResponse = await fetch(
      `${ETSY_API_BASE}/application/shops/${ETSY_SHOP_ID}/listings/active?limit=3`,
      { headers }
    );

    if (!listingResponse.ok) {
      const error = await listingResponse.text();
      return NextResponse.json({
        error: 'Failed to fetch listings',
        details: error,
        status: listingResponse.status,
      }, { status: 500 });
    }

    const listingData = await listingResponse.json();
    
    if (!listingData.results || listingData.results.length === 0) {
      return NextResponse.json({
        error: 'No active listings found',
        shopId: ETSY_SHOP_ID,
      }, { status: 404 });
    }

    const results = [];

    // Step 3: Process multiple listings for better analysis
    for (const listing of listingData.results.slice(0, 3)) {
      console.log(`🔍 Processing listing: ${listing.title}`);
      
      let taxonomyInfo = null;
      let taxonomyPath = [];
      let category = 'unknown';

        if (listing.taxonomy_id) {
        try {
          // Get SellerTaxonomy node - more accurate for seller-created listings
          const taxonomyResponse = await fetch(
            `${ETSY_API_BASE}/application/seller-taxonomy/nodes/${listing.taxonomy_id}`,
            { headers }
          );

          if (taxonomyResponse.ok) {
            taxonomyInfo = await taxonomyResponse.json();
            console.log(`📂 SellerTaxonomy for "${listing.title}":`, taxonomyInfo);

            // Get taxonomy path (breadcrumb) for SellerTaxonomy
            const pathResponse = await fetch(
              `${ETSY_API_BASE}/application/seller-taxonomy/nodes/${listing.taxonomy_id}/path`,
              { headers }
            );

            if (pathResponse.ok) {
              const pathData = await pathResponse.json();
              taxonomyPath = pathData.results || [];
              console.log(`🗂️  SellerTaxonomy path:`, taxonomyPath.map(p => p.name).join(' > '));
            }

            // Map to our category
            category = mapSellerTaxonomyToCategory(taxonomyInfo, taxonomyPath);
          } else {
            console.warn(`SellerTaxonomy not found for taxonomy_id ${listing.taxonomy_id}, response:`, taxonomyResponse.status);
          }
        } catch (taxonomyError) {
          console.warn(`Failed to fetch SellerTaxonomy for ${listing.listing_id}:`, taxonomyError);
        }
      }

      results.push({
        listingId: listing.listing_id,
        title: listing.title,
        taxonomyId: listing.taxonomy_id,
        etsySellerCategory: taxonomyInfo?.name || 'Unknown',
        sellerTaxonomyPath: taxonomyPath.map(p => p.name).join(' > '),
        ourCategory: category,
        tags: listing.tags?.slice(0, 5) || [],
        url: listing.url,
        fullTaxonomyInfo: taxonomyInfo ? {
          id: taxonomyInfo.id,
          name: taxonomyInfo.name,
          level: taxonomyInfo.level,
          full_path_taxonomy_ids: taxonomyInfo.full_path_taxonomy_ids
        } : null,
      });
    }

    return NextResponse.json({
      success: true,
      totalListings: listingData.count,
      analyzedListings: results.length,
      results: results,
      timestamp: new Date().toISOString(),
      recommendations: generateRecommendations(results),
    });

  } catch (error: any) {
    console.error('Taxonomy test error:', error);
    return NextResponse.json({
      error: 'Taxonomy test failed',
      message: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * Map Etsy SellerTaxonomy to our internal categories
 */
function mapSellerTaxonomyToCategory(taxonomy: any, taxonomyPath: any[]): string {
  if (!taxonomy) return 'unknown';
  
  // Get all names from the taxonomy path (parent categories)
  const allNames = [
    taxonomy.name.toLowerCase(),
    ...taxonomyPath.map(p => p.name.toLowerCase())
  ];

  console.log(`🎯 SellerTaxonomy analysis for "${taxonomy.name}":`, allNames);

  // Enhanced category mapping based on SellerTaxonomy structure
  // SellerTaxonomy often has more specific seller-focused categories
  
  // Earrings - extensive matching including seller terminology
  if (allNames.some(name => 
    name.includes('earring') || name.includes('ear') || name.includes('stud') || 
    name.includes('hoop') || name.includes('drop') || name.includes('dangle') ||
    name.includes('chandelier') || name.includes('climber') || name.includes('huggie')
  )) {
    return 'earrings';
  }
  
  // Necklaces - seller taxonomy often separates these clearly
  if (allNames.some(name => 
    name.includes('necklace') || name.includes('pendant') || name.includes('chain') || 
    name.includes('choker') || name.includes('collar') || name.includes('lariat') ||
    name.includes('y necklace') || name.includes('statement necklace')
  )) {
    return 'necklaces';
  }
  
  // Bracelets - including seller-specific terms
  if (allNames.some(name => 
    name.includes('bracelet') || name.includes('bangle') || name.includes('wrist') || 
    name.includes('anklet') || name.includes('charm bracelet') || name.includes('cuff') ||
    name.includes('tennis bracelet') || name.includes('wrap bracelet')
  )) {
    return 'bracelets';
  }
  
  // Rings - excluding earrings but including ring-specific terms
  if (allNames.some(name => 
    name.includes('ring') && !name.includes('earring') && !name.includes('spring')
  )) {
    return 'rings';
  }

  // Check for broader jewelry categories in SellerTaxonomy
  if (allNames.some(name => 
    name.includes('jewelry') || name.includes('jewellery')
  )) {
    // If we have jewelry but can't categorize specifically, use tags as backup
    const tagHints = (taxonomy.name || '').toLowerCase();
    
    if (tagHints.includes('ear')) return 'earrings';
    if (tagHints.includes('neck') || tagHints.includes('chain')) return 'necklaces';
    if (tagHints.includes('wrist') || tagHints.includes('arm')) return 'bracelets';
    if (tagHints.includes('finger') || tagHints.includes('ring')) return 'rings';
  }

  // Default fallback - most jewelry shops have bracelets as primary
  return 'bracelets';
}

/**
 * Generate recommendations based on taxonomy analysis
 */
function generateRecommendations(results: any[]): string[] {
  const recommendations = [];
  
  const categoryCount = results.reduce((acc: any, item) => {
    acc[item.ourCategory] = (acc[item.ourCategory] || 0) + 1;
    return acc;
  }, {});

  recommendations.push(`Found ${results.length} products across ${Object.keys(categoryCount).length} categories`);
  
  Object.entries(categoryCount).forEach(([category, count]) => {
    recommendations.push(`${category}: ${count} products`);
  });

  if (results.some(r => r.taxonomyId === null)) {
    recommendations.push('⚠️ Some products have no taxonomy_id - these will use fallback categorization');
  }

  if (results.some(r => r.ourCategory === 'unknown')) {
    recommendations.push('⚠️ Some products could not be categorized - review taxonomy mapping');
  }

  return recommendations;
}
