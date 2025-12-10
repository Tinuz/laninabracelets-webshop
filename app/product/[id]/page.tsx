import { ProductDetail } from '@/src/page-components/ProductDetail';
import { getProducts, getProductById } from '@/src/lib/products';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  const allProducts = await getProducts();
  const relatedProducts = product 
    ? allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)
    : [];
  
  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}

