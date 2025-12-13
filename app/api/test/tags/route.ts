import { NextResponse } from 'next/server';
import { getProducts } from '@/src/lib/products';

/**
 * Test the new tag-based category mapping system
 * Shows how products are categorized using Dutch tags
 */
export async function GET() {
  try {
    console.log('🏷️  Testing tag-based category mapping...');
    
    const products = await getProducts();
    
    if (products.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No products found - check OAuth authentication',
        products: [],
        categoryCounts: {},
      });
    }

    // Analyze categorization results
    const categoryAnalysis = products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      tags: product.tags?.slice(0, 8) || [],
      // Show which tag triggered the category
      categoryTrigger: determineCategoryTrigger(product),
    }));

    // Count products per category
    const categoryCounts = products.reduce((acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    // Filter analysis
    const filterTests = {
      earrings: products.filter(p => p.category === 'earrings'),
      bracelets: products.filter(p => p.category === 'bracelets'),
      necklaces: products.filter(p => p.category === 'necklaces'),
      rings: products.filter(p => p.category === 'rings'),
    };

    return NextResponse.json({
      success: true,
      message: 'Tag-based category mapping analysis',
      totalProducts: products.length,
      categoryCounts: categoryCounts,
      products: categoryAnalysis,
      filterTests: {
        earrings: `${filterTests.earrings.length} products`,
        bracelets: `${filterTests.bracelets.length} products`, 
        necklaces: `${filterTests.necklaces.length} products`,
        rings: `${filterTests.rings.length} products`,
      },
      recommendations: generateTagRecommendations(categoryAnalysis),
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Tag mapping test error:', error);
    return NextResponse.json({
      error: 'Tag mapping test failed',
      message: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * Determine which tag/rule triggered the category assignment
 */
function determineCategoryTrigger(product: any): string {
  const tags = (product.tags || []).map((t: string) => t.toLowerCase().trim());
  const title = product.name.toLowerCase();
  
  // Check exact tag matches first
  if (tags.includes('oorbel') || tags.includes('oorbellen')) {
    return 'exact_tag: oorbellen';
  }
  if (tags.includes('armband') || tags.includes('armbanden')) {
    return 'exact_tag: armband';
  }
  if (tags.includes('ketting') || tags.includes('kettingen')) {
    return 'exact_tag: ketting';
  }
  if (tags.includes('ring') || tags.includes('ringen')) {
    return 'exact_tag: ring';
  }
  
  // Check fallback matches
  const allTerms = [...tags, title];
  if (allTerms.some(term => term.includes('oorbel') || term.includes('earring'))) {
    return 'fallback: oorbel_match';
  }
  if (allTerms.some(term => term.includes('ketting') || term.includes('necklace'))) {
    return 'fallback: ketting_match';
  }
  if (allTerms.some(term => term.includes('armband') || term.includes('bracelet'))) {
    return 'fallback: armband_match';
  }
  if (allTerms.some(term => term.includes('ring') && !term.includes('earring'))) {
    return 'fallback: ring_match';
  }
  
  return 'default: bracelets';
}

/**
 * Generate recommendations for improving tag-based categorization
 */
function generateTagRecommendations(analysis: any[]): string[] {
  const recommendations = [];
  
  const exactTagMatches = analysis.filter(p => p.categoryTrigger.startsWith('exact_tag')).length;
  const fallbackMatches = analysis.filter(p => p.categoryTrigger.startsWith('fallback')).length;
  const defaultMatches = analysis.filter(p => p.categoryTrigger.startsWith('default')).length;
  
  recommendations.push(`${exactTagMatches} products categorized by exact Dutch tags`);
  recommendations.push(`${fallbackMatches} products categorized by fallback matching`);
  recommendations.push(`${defaultMatches} products using default category (bracelets)`);
  
  if (defaultMatches > 0) {
    recommendations.push('⚠️ Consider adding specific category tags to products using default category');
  }
  
  if (exactTagMatches > fallbackMatches) {
    recommendations.push('✅ Exact tag matching working well - consistent tagging approach');
  }
  
  // Check for specific issues
  const oorbellencProducts = analysis.filter(p => 
    p.tags.some((tag: string) => tag.toLowerCase().includes('oorbel'))
  );
  
  if (oorbellencProducts.length > 0) {
    const correctlyCategorized = oorbellencProducts.filter(p => p.category === 'earrings');
    recommendations.push(`${correctlyCategorized.length}/${oorbellencProducts.length} oorbellen products correctly categorized`);
  }
  
  return recommendations;
}
