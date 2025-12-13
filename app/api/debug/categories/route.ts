import { NextResponse } from 'next/server';
import { getEtsyListings, mapEtsyListingToProduct } from '@/src/lib/etsy-client';

export async function GET() {
  try {
    const listings = await getEtsyListings();
    
    if (listings.length === 0) {
      return NextResponse.json({
        message: 'No Etsy listings found - using fallback data or OAuth not configured',
        categories: {},
        products: [],
      });
    }

    const products = listings.map(mapEtsyListingToProduct);
    
    // Group products by category for analysis
    const categoryCounts = products.reduce((acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    // Detailed product info for debugging
    const detailedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      tags: product.tags?.slice(0, 5) || [], // First 5 tags only
      etsyUrl: product.etsyUrl,
    }));

    return NextResponse.json({
      totalProducts: products.length,
      categories: categoryCounts,
      products: detailedProducts,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to fetch category debug info',
      message: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
