import { NextResponse } from 'next/server';
import { getEtsyShop } from '@/src/lib/etsy-client';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Revalidate every 24 hours

export async function GET() {
  try {
    const shop = await getEtsyShop();
    
    if (!shop) {
      return NextResponse.json(
        {
          success: false,
          error: 'Shop not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch shop',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

