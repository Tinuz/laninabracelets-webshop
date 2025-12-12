import { NextResponse } from 'next/server';
import { getInstagramPostsWithFallback } from '@/src/lib/instagram-client';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const posts = await getInstagramPostsWithFallback(8);

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    // Silently handle error - return fallback data
    return NextResponse.json(
      {
        success: false,
        error: 'Instagram posts temporarily unavailable',
        posts: [], // Return empty array for graceful handling
      },
      { status: 200 } // Return 200 to avoid error display
    );
  }
}
