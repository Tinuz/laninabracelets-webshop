/**
 * Test script to fetch Etsy listings and map categories using official taxonomy
 * Uses Etsy BuyerTaxonomy API: https://developer.etsy.com/documentation/reference/#tag/BuyerTaxonomy
 */

import { config } from 'dotenv';
config();

const ETSY_API_BASE = 'https://openapi.etsy.com/v3';
const ETSY_API_KEY = process.env.ETSY_API_KEY;
const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID;

// We'll need to get OAuth token from Redis storage
async function getOAuthToken() {
  try {
    // In production, we'd use our Redis storage
    // For this test, we'll make a direct call to our API
    const response = await fetch('http://localhost:3000/api/admin/oauth/status');
    const data = await response.json();
    
    if (!data.authenticated || !data.tokens?.access_token) {
      throw new Error('No valid OAuth token. Please authenticate first via /admin/oauth');
    }
    
    return data.tokens.access_token;
  } catch (error) {
    console.error('Failed to get OAuth token:', error.message);
    return null;
  }
}

/**
 * Get Etsy API headers with OAuth
 */
async function getEtsyHeaders() {
  const accessToken = await getOAuthToken();
  
  if (!accessToken) {
    throw new Error('No OAuth token available');
  }

  return {
    'Authorization': `Bearer ${accessToken}`,
    'x-api-key': ETSY_API_KEY,
    'Content-Type': 'application/json',
  };
}

/**
 * Fetch a sample listing from our shop
 */
async function getSampleListing() {
  console.log('📦 Fetching sample listing from shop...');
  
  const headers = await getEtsyHeaders();
  const response = await fetch(
    `${ETSY_API_BASE}/application/shops/${ETSY_SHOP_ID}/listings/active?limit=1`,
    { headers }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch listings: ${response.status} ${error}`);
  }

  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    throw new Error('No active listings found in shop');
  }

  const listing = data.results[0];
  console.log('✅ Sample listing:', {
    id: listing.listing_id,
    title: listing.title,
    taxonomy_id: listing.taxonomy_id,
    tags: listing.tags?.slice(0, 3) || [],
  });

  return listing;
}

/**
 * Fetch taxonomy information using BuyerTaxonomy API
 * https://developer.etsy.com/documentation/reference/#tag/BuyerTaxonomy
 */
async function getTaxonomyInfo(taxonomyId) {
  console.log(`🔍 Fetching taxonomy info for ID: ${taxonomyId}...`);
  
  const headers = await getEtsyHeaders();
  
  // Get the specific taxonomy node
  const response = await fetch(
    `${ETSY_API_BASE}/application/buyer-taxonomy/nodes/${taxonomyId}`,
    { headers }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch taxonomy: ${response.status} ${error}`);
  }

  const taxonomy = await response.json();
  console.log('📂 Taxonomy node:', taxonomy);

  // Get the full taxonomy path (breadcrumb)
  const pathResponse = await fetch(
    `${ETSY_API_BASE}/application/buyer-taxonomy/nodes/${taxonomyId}/path`,
    { headers }
  );

  let taxonomyPath = [];
  if (pathResponse.ok) {
    const pathData = await pathResponse.json();
    taxonomyPath = pathData.results || [];
    console.log('🗂️  Taxonomy path:', taxonomyPath.map(p => p.name).join(' > '));
  }

  return { taxonomy, taxonomyPath };
}

/**
 * Map Etsy taxonomy to our internal categories
 */
function mapTaxonomyToCategory(taxonomy, taxonomyPath) {
  console.log('🎯 Mapping taxonomy to category...');
  
  // Get all names from the taxonomy path (parent categories)
  const allNames = taxonomyPath.map(p => p.name.toLowerCase());
  const currentName = taxonomy.name.toLowerCase();
  
  console.log('📝 All taxonomy names:', [currentName, ...allNames]);

  // Enhanced category mapping based on official Etsy taxonomy
  if (allNames.some(name => 
    name.includes('earring') || name.includes('ear') || 
    currentName.includes('earring') || currentName.includes('ear')
  )) {
    return 'earrings';
  }
  
  if (allNames.some(name => 
    name.includes('necklace') || name.includes('pendant') || name.includes('chain') ||
    currentName.includes('necklace') || currentName.includes('pendant') || currentName.includes('chain')
  )) {
    return 'necklaces';
  }
  
  if (allNames.some(name => 
    name.includes('bracelet') || name.includes('bangle') || name.includes('wrist') ||
    currentName.includes('bracelet') || currentName.includes('bangle') || currentName.includes('wrist')
  )) {
    return 'bracelets';
  }
  
  if (allNames.some(name => 
    name.includes('ring') || currentName.includes('ring')
  )) {
    return 'rings';
  }

  // Default fallback
  return 'bracelets';
}

/**
 * Main test function
 */
async function testTaxonomyMapping() {
  console.log('🚀 Starting Etsy Taxonomy Test...\n');

  try {
    // Step 1: Get a sample listing
    const listing = await getSampleListing();
    
    if (!listing.taxonomy_id) {
      console.warn('⚠️  Listing has no taxonomy_id - using fallback method');
      return;
    }

    console.log(''); // spacing

    // Step 2: Get taxonomy information
    const { taxonomy, taxonomyPath } = await getTaxonomyInfo(listing.taxonomy_id);

    console.log(''); // spacing

    // Step 3: Map to our category
    const category = mapTaxonomyToCategory(taxonomy, taxonomyPath);

    console.log(''); // spacing

    // Step 4: Results
    console.log('📊 RESULTS:');
    console.log('============');
    console.log(`Product: "${listing.title}"`);
    console.log(`Taxonomy ID: ${listing.taxonomy_id}`);
    console.log(`Etsy Category: ${taxonomy.name}`);
    console.log(`Full Path: ${taxonomyPath.map(p => p.name).join(' > ')}`);
    console.log(`Our Category: ${category}`);
    console.log(`Tags: ${listing.tags?.join(', ') || 'none'}`);
    
    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('  - Development server is running (npm run dev)');
    console.log('  - OAuth is authenticated (/admin/oauth)');
    console.log('  - Environment variables are set (.env.local)');
  }
}

// Run the test
testTaxonomyMapping();
