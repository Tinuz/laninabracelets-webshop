import { NextResponse } from 'next/server';

/**
 * Test public taxonomy endpoints (no OAuth required)
 * Some Etsy taxonomy endpoints might be public
 */
export async function GET() {
  const ETSY_API_KEY = process.env.ETSY_API_KEY;
  
  if (!ETSY_API_KEY) {
    return NextResponse.json({
      error: 'ETSY_API_KEY not configured'
    }, { status: 500 });
  }

  const testTaxonomyIds = [1, 68, 69, 164, 165, 1208, 1429];
  const results = [];

  console.log('🌐 Testing PUBLIC taxonomy endpoints (no OAuth)...');

  for (const testId of testTaxonomyIds) {
    console.log(`\n🧪 Testing taxonomy ID ${testId} via public endpoints...`);
    
    const testResult: any = {
      id: testId,
      publicSellerTaxonomy: 'untested',
      publicBuyerTaxonomy: 'untested',
    };

    try {
      // Test 1: Public SellerTaxonomy (API key only)
      const publicSellerUrl = `https://openapi.etsy.com/v3/application/seller-taxonomy/nodes/${testId}`;
      console.log(`🔗 Public Seller URL: ${publicSellerUrl}`);
      
      const publicSellerResponse = await fetch(publicSellerUrl, {
        headers: {
          'x-api-key': ETSY_API_KEY,
          'Content-Type': 'application/json',
        }
      });
      
      console.log(`📊 Public Seller response: ${publicSellerResponse.status}`);
      
      if (publicSellerResponse.ok) {
        const sellerData = await publicSellerResponse.json();
        testResult.publicSellerTaxonomy = 'found';
        testResult.sellerName = sellerData.name;
        testResult.sellerLevel = sellerData.level;
        console.log(`✅ Public Seller found: ${sellerData.name}`);
      } else {
        const errorText = await publicSellerResponse.text();
        testResult.publicSellerTaxonomy = publicSellerResponse.status;
        testResult.sellerError = errorText.substring(0, 100);
        console.log(`❌ Public Seller error: ${errorText.substring(0, 100)}`);
      }

      // Test 2: Public BuyerTaxonomy (API key only)  
      const publicBuyerUrl = `https://openapi.etsy.com/v3/application/buyer-taxonomy/nodes/${testId}`;
      console.log(`🔗 Public Buyer URL: ${publicBuyerUrl}`);
      
      const publicBuyerResponse = await fetch(publicBuyerUrl, {
        headers: {
          'x-api-key': ETSY_API_KEY,
          'Content-Type': 'application/json',
        }
      });
      
      console.log(`📊 Public Buyer response: ${publicBuyerResponse.status}`);
      
      if (publicBuyerResponse.ok) {
        const buyerData = await publicBuyerResponse.json();
        testResult.publicBuyerTaxonomy = 'found';
        testResult.buyerName = buyerData.name;
        testResult.buyerLevel = buyerData.level;
        console.log(`✅ Public Buyer found: ${buyerData.name}`);
      } else {
        const errorText = await publicBuyerResponse.text();
        testResult.publicBuyerTaxonomy = publicBuyerResponse.status;
        testResult.buyerError = errorText.substring(0, 100);
        console.log(`❌ Public Buyer error: ${errorText.substring(0, 100)}`);
      }

      // Test 3: Try to get taxonomy tree/root nodes
      if (testId === 1) {
        try {
          const rootUrl = `https://openapi.etsy.com/v3/application/seller-taxonomy/nodes`;
          const rootResponse = await fetch(rootUrl, {
            headers: {
              'x-api-key': ETSY_API_KEY,
              'Content-Type': 'application/json',
            }
          });
          
          testResult.rootTaxonomyTest = rootResponse.status;
          if (rootResponse.ok) {
            const rootData = await rootResponse.json();
            testResult.rootTaxonomyCount = rootData.results?.length || 0;
            console.log(`🌳 Root taxonomy nodes: ${rootData.results?.length || 0}`);
          }
        } catch (error) {
          testResult.rootTaxonomyTest = 'error';
        }
      }

    } catch (error: any) {
      console.log(`💥 Network error for ID ${testId}:`, error.message);
      testResult.publicSellerTaxonomy = 'network_error';
      testResult.publicBuyerTaxonomy = 'network_error';
      testResult.error = error.message;
    }

    results.push(testResult);
  }

  return NextResponse.json({
    success: true,
    message: 'Testing public taxonomy endpoints without OAuth',
    apiKeyOnly: true,
    currentScopes: ['shops_r', 'listings_r'],
    missingScopes: 'Potentially taxonomy-related scopes needed',
    results: results,
    summary: {
      totalTested: results.length,
      sellerFound: results.filter(r => r.publicSellerTaxonomy === 'found').length,
      buyerFound: results.filter(r => r.publicBuyerTaxonomy === 'found').length,
    },
    timestamp: new Date().toISOString(),
  });
}
