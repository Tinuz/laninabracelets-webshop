import { ProductDetail } from '@/src/page-components/ProductDetail';
import { getProducts, getProductById } from '@/src/lib/products';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  const allProducts = await getProducts();
  const relatedProducts = product 
    ? allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)
    : [];
  
  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}

