#!/usr/bin/env node

/**
 * Helper script to get your Etsy Shop ID
 * 
 * Usage:
 *   node scripts/get-shop-id.js YOUR_SHOP_NAME
 * 
 * Example:
 *   node scripts/get-shop-id.js LaNinaBracelets
 */

const shopName = process.argv[2];
const apiKey = 'rg4tmn3xzesq2a5vczf0os1w';

if (!shopName) {
  console.error('❌ Error: Shop name is required!');
  console.log('\n📖 Usage:');
  console.log('  node scripts/get-shop-id.js YOUR_SHOP_NAME\n');
  console.log('Example:');
  console.log('  node scripts/get-shop-id.js LaNinaBracelets\n');
  process.exit(1);
}

console.log(`🔍 Looking up shop: ${shopName}...\n`);

const url = `https://api.etsy.com/v3/application/shops?shop_name=${encodeURIComponent(shopName)}`;

try {
  const response = await fetch(url, {
    headers: {
      'x-api-key': apiKey,
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.results && data.results.length > 0) {
    const shop = data.results[0];
    console.log('✅ Shop found!\n');
    console.log('📊 Shop Details:');
    console.log('  Name:', shop.shop_name);
    console.log('  Shop ID:', shop.shop_id);
    console.log('  URL:', shop.url);
    console.log('  Active Listings:', shop.listing_active_count);
    console.log('\n📝 Add this to your .env.local file:');
    console.log(`  ETSY_SHOP_ID=${shop.shop_id}\n`);
  } else {
    console.error('❌ Shop not found!');
    console.log('\nTips:');
    console.log('  • Check if the shop name is correct');
    console.log('  • Shop name is case-sensitive');
    console.log('  • Try the exact name from your shop URL\n');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\nTips:');
  console.log('  • Check your internet connection');
  console.log('  • Verify the API key is correct');
  console.log('  • Make sure your Etsy API app is approved\n');
}
