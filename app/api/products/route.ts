import { NextResponse } from 'next/server';
import { getProducts } from '@/src/lib/etsy-client';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const products = await getProducts();
    
    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    // Silently handle error - fallback will be used
    return NextResponse.json(
      {
        success: false,
        error: 'Products temporarily unavailable',
        products: [], // Return empty array for graceful handling
      },
      { status: 200 } // Return 200 to avoid error display
    );
  }
}

