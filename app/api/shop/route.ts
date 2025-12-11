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
    // Silently handle error
    return NextResponse.json(
      {
        success: false,
        error: 'Shop information temporarily unavailable',
      },
      { status: 404 }
    );
  }
}

