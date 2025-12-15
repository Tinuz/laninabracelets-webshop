import { NextResponse } from 'next/server';
import { getProducts } from '../../../../src/lib/products';

export async function GET() {
  try {
    const products = await getProducts();
    
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const braceletProducts = products.filter(p => p.category === 'bracelets');

    return NextResponse.json({
      success: true,
      totalProducts: products.length,
      categoryCounts,
      braceletProducts: braceletProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        tags: p.tags?.slice(0, 5) // First 5 tags only
      })),
      sampleProducts: products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        tags: p.tags?.slice(0, 3)
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('Debug products error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
