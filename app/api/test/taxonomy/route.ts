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
      `${ETSY_API_BASE}/application/shops/${ETSY_SHOP_ID}/listings/active?limit=10`,
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
        let taxonomyProperties = [];
        let category = 'unknown';

        if (listing.taxonomy_id) {
        let taxonomySource = 'none';
        
        try {
          // Try SellerTaxonomy first - more accurate for seller-created listings
          console.log(`🔍 Trying SellerTaxonomy for taxonomy_id: ${listing.taxonomy_id}`);
          
          const sellerTaxonomyResponse = await fetch(
            `${ETSY_API_BASE}/application/seller-taxonomy/nodes/${listing.taxonomy_id}`,
            { headers }
          );

          if (sellerTaxonomyResponse.ok) {
            taxonomyInfo = await sellerTaxonomyResponse.json();
            taxonomySource = 'seller';
            console.log(`✅ SellerTaxonomy found for "${listing.title}":`, taxonomyInfo.name);

            // Get taxonomy path for SellerTaxonomy
            const pathResponse = await fetch(
              `${ETSY_API_BASE}/application/seller-taxonomy/nodes/${listing.taxonomy_id}/path`,
              { headers }
            );

            if (pathResponse.ok) {
              const pathData = await pathResponse.json();
              taxonomyPath = pathData.results || [];
            }

            // Get taxonomy properties for additional categorization info
            const propertiesResponse = await fetch(
              `${ETSY_API_BASE}/application/seller-taxonomy/nodes/${listing.taxonomy_id}/properties`,
              { headers }
            );

            let taxonomyProperties = [];
            if (propertiesResponse.ok) {
              const propertiesData = await propertiesResponse.json();
              taxonomyProperties = propertiesData.results || [];
              console.log(`🏷️  SellerTaxonomy properties for "${listing.title}":`, 
                taxonomyProperties.map(p => p.name).slice(0, 5)
              );
            }

            category = mapSellerTaxonomyToCategory(taxonomyInfo, taxonomyPath, taxonomyProperties);
            
          } else if (sellerTaxonomyResponse.status === 404) {
            // Fallback to BuyerTaxonomy if SellerTaxonomy doesn't exist
            console.log(`⚠️  SellerTaxonomy 404 for taxonomy_id ${listing.taxonomy_id}, trying BuyerTaxonomy...`);
            
            const buyerTaxonomyResponse = await fetch(
              `${ETSY_API_BASE}/application/buyer-taxonomy/nodes/${listing.taxonomy_id}`,
              { headers }
            );

            if (buyerTaxonomyResponse.ok) {
              taxonomyInfo = await buyerTaxonomyResponse.json();
              taxonomySource = 'buyer';
              console.log(`✅ BuyerTaxonomy found for "${listing.title}":`, taxonomyInfo.name);

              // Get taxonomy path for BuyerTaxonomy
              const pathResponse = await fetch(
                `${ETSY_API_BASE}/application/buyer-taxonomy/nodes/${listing.taxonomy_id}/path`,
                { headers }
              );

              if (pathResponse.ok) {
                const pathData = await pathResponse.json();
                taxonomyPath = pathData.results || [];
              }

              // Get BuyerTaxonomy properties as fallback
              const buyerPropertiesResponse = await fetch(
                `${ETSY_API_BASE}/application/buyer-taxonomy/nodes/${listing.taxonomy_id}/properties`,
                { headers }
              );

              if (buyerPropertiesResponse.ok) {
                const propertiesData = await buyerPropertiesResponse.json();
                taxonomyProperties = propertiesData.results || [];
                console.log(`🏷️  BuyerTaxonomy properties for "${listing.title}":`, 
                  taxonomyProperties.map((p: any) => p.name).slice(0, 5)
                );
              }

              category = mapBuyerTaxonomyToCategory(taxonomyInfo, taxonomyPath, taxonomyProperties);
              
            } else {
              const buyerErrorText = await buyerTaxonomyResponse.text();
              console.warn(`❌ BuyerTaxonomy also failed ${buyerTaxonomyResponse.status} for taxonomy_id ${listing.taxonomy_id}:`, buyerErrorText);
              console.warn(`❌ Both SellerTaxonomy and BuyerTaxonomy failed for taxonomy_id ${listing.taxonomy_id}`);
              taxonomySource = 'failed';
              // Will fall back to tag-based categorization
              category = mapTagsToCategory(listing);
            }
          } else {
            const errorText = await sellerTaxonomyResponse.text();
            console.warn(`❌ SellerTaxonomy error ${sellerTaxonomyResponse.status} for taxonomy_id ${listing.taxonomy_id}:`, errorText);
            taxonomySource = 'failed';
            category = mapTagsToCategory(listing);
          }
        } catch (taxonomyError) {
          console.warn(`Taxonomy fetch error for ${listing.listing_id}:`, taxonomyError);
          taxonomySource = 'error';
          category = mapTagsToCategory(listing);
        }
        
        // Add taxonomy source to result for debugging
        taxonomyInfo = taxonomyInfo ? { ...taxonomyInfo, _source: taxonomySource } : { _source: taxonomySource };
      }

      results.push({
        listingId: listing.listing_id,
        title: listing.title,
        taxonomyId: listing.taxonomy_id,
        taxonomySource: taxonomyInfo?._source || 'none',
        etsyCategory: taxonomyInfo?.name || 'Unknown',
        taxonomyPath: taxonomyPath.map(p => p.name).join(' > '),
        taxonomyProperties: (taxonomyProperties || []).map((p: any) => p.name).slice(0, 5),
        ourCategory: category,
        tags: listing.tags?.slice(0, 5) || [],
        url: listing.url,
        fullTaxonomyInfo: taxonomyInfo && taxonomyInfo.id ? {
          id: taxonomyInfo.id,
          name: taxonomyInfo.name,
          level: taxonomyInfo.level,
          source: taxonomyInfo._source,
          full_path_taxonomy_ids: taxonomyInfo.full_path_taxonomy_ids,
          properties_count: (taxonomyProperties || []).length
        } : null,
      });
    }

    // Test some known taxonomy IDs to verify API connectivity
    const testTaxonomyIds = [1, 68, 69, 164, 165, 1208, 1429]; // Common jewelry categories + user suggestions
    const taxonomyTests = [];

    for (const testId of testTaxonomyIds) {
      try {
        const testResponse = await fetch(
          `${ETSY_API_BASE}/application/seller-taxonomy/nodes/${testId}`,
          { headers }
        );
        
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log(`✅ Test taxonomy ID ${testId} found:`, testData.name);
          
          // If this is ID 1429, also test BuyerTaxonomy and get properties
          if (testId === 1429) {
            try {
              const buyerTest = await fetch(
                `${ETSY_API_BASE}/application/buyer-taxonomy/nodes/${testId}`,
                { headers }
              );
              const propertiesTest = await fetch(
                `${ETSY_API_BASE}/application/seller-taxonomy/nodes/${testId}/properties`,
                { headers }
              );
              
              taxonomyTests.push({
                id: testId,
                sellerTaxonomy: 'found',
                buyerTaxonomy: buyerTest.ok ? 'found' : buyerTest.status,
                properties: propertiesTest.ok ? 'found' : propertiesTest.status,
                name: testData.name,
                level: testData.level,
                fullData: testData
              });

              if (propertiesTest.ok) {
                const propData = await propertiesTest.json();
                console.log(`🏷️  ID 1429 properties:`, propData.results?.map((p: any) => p.name).slice(0, 5));
              }
            } catch (error) {
              taxonomyTests.push({
                id: testId,
                sellerTaxonomy: 'found',
                error: 'Failed to test additional APIs'
              });
            }
          } else {
            taxonomyTests.push({
              id: testId,
              sellerTaxonomy: 'found',
              name: testData.name
            });
          }
        } else {
          taxonomyTests.push({
            id: testId,
            sellerTaxonomy: testResponse.status,
          });
        }
      } catch (error) {
        taxonomyTests.push({
          id: testId,
          sellerTaxonomy: 'error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      totalListings: listingData.count,
      analyzedListings: results.length,
      results: results,
      taxonomyTests: taxonomyTests,
      debug: {
        problematicTaxonomyId: 1208,
        message: "ID 1208 seems to not exist in either SellerTaxonomy or BuyerTaxonomy",
        fallbackWorking: results.every(r => r.ourCategory !== 'unknown')
      },
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
 * Uses taxonomy properties from getPropertiesByTaxonomyId for enhanced categorization
 */
function mapSellerTaxonomyToCategory(taxonomy: any, taxonomyPath: any[], properties: any[] = []): string {
  if (!taxonomy) return 'unknown';
  
  // Get all names from the taxonomy path (parent categories)
  const allNames = [
    taxonomy.name.toLowerCase(),
    ...taxonomyPath.map(p => p.name.toLowerCase())
  ];

  // Include property names for more accurate categorization
  const propertyNames = properties.map((p: any) => p.name.toLowerCase());
  const allTerms = [...allNames, ...propertyNames];

  console.log(`🎯 SellerTaxonomy analysis for "${taxonomy.name}":`, {
    taxonomy: allNames,
    properties: propertyNames.slice(0, 3),
    totalTerms: allTerms.length
  });

  // Enhanced category mapping using taxonomy + properties
  // Properties from getPropertiesByTaxonomyId provide additional context
  
  // Earrings - check both taxonomy and properties
  if (allTerms.some(term => 
    term.includes('earring') || term.includes('ear') || term.includes('stud') || 
    term.includes('hoop') || term.includes('drop') || term.includes('dangle') ||
    term.includes('chandelier') || term.includes('climber') || term.includes('huggie') ||
    term.includes('post') || term.includes('wire') || term.includes('hook')
  )) {
    return 'earrings';
  }
  
  // Necklaces - enhanced with property-based detection
  if (allTerms.some(term => 
    term.includes('necklace') || term.includes('pendant') || term.includes('chain') || 
    term.includes('choker') || term.includes('collar') || term.includes('lariat') ||
    term.includes('y necklace') || term.includes('statement necklace') ||
    term.includes('length') || term.includes('neck') || term.includes('charm')
  )) {
    return 'necklaces';
  }
  
  // Bracelets - enhanced with wrist/arm related properties
  if (allTerms.some(term => 
    term.includes('bracelet') || term.includes('bangle') || term.includes('wrist') || 
    term.includes('anklet') || term.includes('charm bracelet') || term.includes('cuff') ||
    term.includes('tennis bracelet') || term.includes('wrap bracelet') ||
    term.includes('circumference') || term.includes('diameter') || term.includes('size')
  )) {
    return 'bracelets';
  }
  
  // Rings - enhanced with ring-specific properties
  if (allTerms.some(term => 
    (term.includes('ring') && !term.includes('earring') && !term.includes('spring')) ||
    term.includes('band') || term.includes('finger') || term.includes('engagement') ||
    term.includes('wedding') || term.includes('signet')
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
 * Map BuyerTaxonomy to our internal categories (fallback)
 */
function mapBuyerTaxonomyToCategory(taxonomy: any, taxonomyPath: any[], properties: any[] = []): string {
  if (!taxonomy) return 'unknown';
  
  const allNames = [
    taxonomy.name.toLowerCase(),
    ...taxonomyPath.map(p => p.name.toLowerCase())
  ];

  console.log(`🛒 BuyerTaxonomy analysis for "${taxonomy.name}":`, allNames);

  // Buyer taxonomy tends to be more general categories
  if (allNames.some(name => 
    name.includes('earring') || name.includes('ear')
  )) {
    return 'earrings';
  }
  
  if (allNames.some(name => 
    name.includes('necklace') || name.includes('pendant') || name.includes('chain')
  )) {
    return 'necklaces';
  }
  
  if (allNames.some(name => 
    name.includes('bracelet') || name.includes('bangle') || name.includes('wrist')
  )) {
    return 'bracelets';
  }
  
  if (allNames.some(name => 
    name.includes('ring') && !name.includes('earring')
  )) {
    return 'rings';
  }

  return 'bracelets';
}

/**
 * Fallback: Map based on tags and title (our original method)
 */
function mapTagsToCategory(listing: any): string {
  const tags = (listing.tags || []).map((t: string) => t.toLowerCase());
  const materials = (listing.materials || []).map((m: string) => m.toLowerCase());
  const title = listing.title.toLowerCase();
  const allSearchTerms = [...tags, ...materials, title];
  
  console.log(`🏷️  Tag-based analysis for "${listing.title}":`, tags.slice(0, 5));
  
  if (allSearchTerms.some(term => 
    term.includes('ring') && !term.includes('earring')
  )) {
    return 'rings';
  } else if (allSearchTerms.some(term => 
    term.includes('necklace') || term.includes('ketting') || term.includes('halsketting') || term.includes('chain')
  )) {
    return 'necklaces';
  } else if (allSearchTerms.some(term => 
    term.includes('earring') || term.includes('oorbel') || term.includes('oorbellen') || 
    term.includes('ear') || term.includes('stud') || term.includes('hoop') || term.includes('drop')
  )) {
    return 'earrings';
  } else if (allSearchTerms.some(term => 
    term.includes('bracelet') || term.includes('armband') || term.includes('bangle') || term.includes('wrist')
  )) {
    return 'bracelets';
  }
  
  return 'bracelets'; // default
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
