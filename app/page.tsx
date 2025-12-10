import { Home } from '@/src/page-components/Home';
import { getProducts } from '@/src/lib/products';

export default async function HomePage() {
  const products = await getProducts();
  
  return <Home products={products} />;
}

