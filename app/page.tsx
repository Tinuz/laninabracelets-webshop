import { Home } from '@/src/page-components/Home';
import { getProducts } from '@/src/lib/products';
import { getInstagramPostsWithFallback } from '@/src/lib/instagram-client';

export default async function HomePage() {
  // Fetch data in parallel
  const [products, instagramPosts] = await Promise.all([
    getProducts(),
    getInstagramPostsWithFallback(8),
  ]);
  
  return <Home products={products} instagramPosts={instagramPosts} />;
}

