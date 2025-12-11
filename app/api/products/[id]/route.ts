import { NextResponse } from 'next/server';
import { getProductById } from '@/src/lib/etsy-client';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    // Silently handle error - return not found for graceful handling
    return NextResponse.json(
      {
        success: false,
        error: 'Product temporarily unavailable',
      },
      { status: 404 }
    );
  }
}

