/**
 * Instagram Basic Display API Client
 * 
 * Setup Instructions:
 * 1. Go to https://developers.facebook.com/apps/
 * 2. Create new app -> "Consumer" type
 * 3. Add "Instagram Basic Display" product
 * 4. Get App ID, App Secret, and Access Token
 * 5. Add to .env.local
 */

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface InstagramResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_API_BASE = 'https://graph.instagram.com';

/**
 * Fetch Instagram posts using Basic Display API
 */
export async function getInstagramPosts(limit: number = 12): Promise<InstagramPost[]> {
  if (!INSTAGRAM_ACCESS_TOKEN) {
    console.warn('Instagram access token not configured');
    return [];
  }

  try {
    const fields = 'id,media_type,media_url,permalink,caption,timestamp,thumbnail_url';
    const url = `${INSTAGRAM_API_BASE}/me/media?fields=${fields}&limit=${limit}&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    
    const response = await fetch(url, {
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      // Silently fail - return empty array for fallback handling
      return [];
    }

    const data: InstagramResponse = await response.json();
    return data.data || [];
  } catch (error) {
    // Silently fail and return empty array
    return [];
  }
}

/**
 * Fallback Instagram posts for when API is unavailable
 */
export const FALLBACK_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: '1',
    media_type: 'IMAGE',
    media_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop',
    permalink: 'https://instagram.com/laninabracelets',
    caption: 'Nieuwe gouden armband collectie! ✨ #LaNinaBracelets #handmade',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    media_type: 'IMAGE',
    media_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop',
    permalink: 'https://instagram.com/laninabracelets',
    caption: 'Behind the scenes: handgemaakt in Amsterdam 💎',
    timestamp: new Date().toISOString(),
  },
  // Add more fallback posts...
];

/**
 * Get Instagram posts with fallback
 */
export async function getInstagramPostsWithFallback(limit: number = 8): Promise<InstagramPost[]> {
  try {
    const posts = await getInstagramPosts(limit);
    
    if (posts && posts.length > 0) {
      return posts;
    }
  } catch (error) {
    // Silently fall back
  }
  
  // Fallback to dummy data
  return FALLBACK_INSTAGRAM_POSTS.slice(0, limit);
}
