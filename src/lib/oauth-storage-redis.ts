/**
 * OAuth Token Storage System - Vercel KV (Redis) Compatible
 * Stores tokens server-side accessible from all devices
 */

import { Redis } from '@upstash/redis';

export interface EtsyOAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp
  expires_in?: number; // Seconds from now (only used during token exchange)
  token_type: string;
  user_id?: string; // Etsy user ID (prefix from token)
  scopes?: string[];
  created_at: number;
  updated_at: number;
}

interface OAuth2State {
  state: string;
  code_verifier: string;
  code_challenge: string;
  redirect_uri: string;
  scopes: string[];
  created_at: number;
}

// Initialize Redis client
const redis = Redis.fromEnv();

// Redis keys
const TOKENS_KEY = 'lanina:oauth:tokens';
const STATE_KEY = 'lanina:oauth:state';

/**
 * Save OAuth tokens to Redis
 */
export async function saveOAuthTokens(tokens: Partial<EtsyOAuthTokens>): Promise<void> {
  const now = Date.now();
  
  // Get existing tokens
  const existingTokens = await loadOAuthTokens();

  const updatedTokens: EtsyOAuthTokens = {
    access_token: tokens.access_token || existingTokens?.access_token || '',
    refresh_token: tokens.refresh_token || existingTokens?.refresh_token || '',
    expires_at: tokens.expires_at || (now + (tokens.expires_in || 3600) * 1000),
    token_type: tokens.token_type || 'Bearer',
    user_id: tokens.user_id || existingTokens?.user_id,
    scopes: tokens.scopes || existingTokens?.scopes || [],
    created_at: existingTokens?.created_at || now,
    updated_at: now,
  };

  // Extract user ID from access token if not provided
  if (!updatedTokens.user_id && updatedTokens.access_token) {
    const userIdMatch = updatedTokens.access_token.match(/^(\d+)\./);
    if (userIdMatch) {
      updatedTokens.user_id = userIdMatch[1];
    }
  }

  // Save to Redis with expiration (7 days)
  await redis.setex(TOKENS_KEY, 7 * 24 * 60 * 60, JSON.stringify(updatedTokens));
  
  console.log('✅ OAuth tokens saved to Redis (accessible from all devices)');
}

/**
 * Load OAuth tokens from Redis
 */
export async function loadOAuthTokens(): Promise<EtsyOAuthTokens | null> {
  try {
    const data = await redis.get(TOKENS_KEY);
    
    if (!data) {
      return null;
    }

    // Parse JSON string to object
    const tokens = typeof data === 'string' ? JSON.parse(data) : data;
    return tokens as EtsyOAuthTokens;
  } catch (error) {
    console.warn('Could not load OAuth tokens from Redis:', error);
    return null;
  }
}

/**
 * Check if tokens are valid (not expired)
 */
export async function areTokensValid(): Promise<boolean> {
  const tokens = await loadOAuthTokens();
  if (!tokens || !tokens.access_token) {
    return false;
  }

  const now = Date.now();
  const isExpired = now >= tokens.expires_at;
  
  return !isExpired;
}

/**
 * Check if we have valid tokens OR valid refresh token
 */
export async function hasValidAuthentication(): Promise<boolean> {
  const tokens = await loadOAuthTokens();
  if (!tokens) return false;

  // Either access token is valid, or we have refresh token
  const isValid = await areTokensValid();
  return isValid || !!tokens.refresh_token;
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await loadOAuthTokens();
  if (!tokens) return null;

  // If current token is still valid, return it
  const isValid = await areTokensValid();
  if (isValid) {
    return tokens.access_token;
  }

  // If we have a refresh token, try to refresh
  if (tokens.refresh_token) {
    try {
      const refreshed = await refreshOAuthToken();
      return refreshed ? refreshed.access_token : null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  return null;
}

/**
 * Refresh OAuth token using refresh token
 */
export async function refreshOAuthToken(): Promise<EtsyOAuthTokens | null> {
  const tokens = await loadOAuthTokens();
  if (!tokens?.refresh_token) {
    throw new Error('No refresh token available');
  }

  const ETSY_API_KEY = process.env.ETSY_API_KEY;
  if (!ETSY_API_KEY) {
    throw new Error('ETSY_API_KEY environment variable not set');
  }

  console.log('🔄 Refreshing OAuth token from Redis...');

  const response = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: ETSY_API_KEY,
      refresh_token: tokens.refresh_token,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${error}`);
  }

  const data = await response.json();
  
  const newTokens: Partial<EtsyOAuthTokens> = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in * 1000),
    token_type: data.token_type,
    scopes: tokens.scopes, // Keep existing scopes
  };

  await saveOAuthTokens(newTokens);
  
  return await loadOAuthTokens();
}

/**
 * Save OAuth state for authorization flow to Redis
 */
export async function saveOAuthState(state: OAuth2State): Promise<void> {
  // Save state with 15 minute expiration
  await redis.setex(STATE_KEY, 15 * 60, JSON.stringify(state));
  console.log('✅ OAuth state saved to Redis');
}

/**
 * Load and validate OAuth state from Redis
 */
export async function loadAndValidateOAuthState(stateParam: string): Promise<OAuth2State | null> {
  try {
    const data = await redis.get(STATE_KEY);
    
    if (!data) {
      console.warn('No OAuth state found in Redis');
      return null;
    }

    const state = typeof data === 'string' ? JSON.parse(data) : data as OAuth2State;
    
    if (!state) {
      return null;
    }

    // Validate state parameter matches
    if (state.state !== stateParam) {
      console.warn('OAuth state mismatch - possible CSRF attack');
      return null;
    }

    // Check if state is not too old (15 minutes max)
    const maxAge = 15 * 60 * 1000; // 15 minutes
    if (Date.now() - state.created_at > maxAge) {
      console.warn('OAuth state expired');
      return null;
    }

    return state;
  } catch (error) {
    console.warn('Could not load OAuth state from Redis:', error);
    return null;
  }
}

/**
 * Clear OAuth state after use
 */
export async function clearOAuthState(): Promise<void> {
  try {
    await redis.del(STATE_KEY);
    console.log('🧹 OAuth state cleared from Redis');
  } catch (error) {
    console.warn('Could not clear OAuth state:', error);
  }
}

/**
 * Clear all OAuth data (logout)
 */
export async function clearAllOAuthData(): Promise<void> {
  try {
    await redis.del(TOKENS_KEY);
    await redis.del(STATE_KEY);
    console.log('🗑️ All OAuth data cleared from Redis');
  } catch (error) {
    console.warn('Could not clear OAuth data:', error);
  }
}

/**
 * Test Redis connection
 */
export async function testRedisConnection(): Promise<boolean> {
  try {
    await redis.set('test', 'connection', { ex: 60 });
    const result = await redis.get('test');
    await redis.del('test');
    
    console.log('✅ Redis connection test successful');
    return result === 'connection';
  } catch (error) {
    console.error('❌ Redis connection test failed:', error);
    return false;
  }
}
