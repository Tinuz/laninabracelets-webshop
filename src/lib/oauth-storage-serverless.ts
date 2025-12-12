/**
 * OAuth Token Storage System - Serverless Compatible
 * Uses encrypted cookies instead of files for Vercel compatibility
 */

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

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

// JWT Secret for encrypting cookies
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

const TOKENS_COOKIE = 'etsy_oauth_tokens';
const STATE_COOKIE = 'etsy_oauth_state';

/**
 * Encrypt data using JWT
 */
async function encrypt(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Tokens expire in 7 days
    .sign(JWT_SECRET);
}

/**
 * Decrypt JWT token
 */
async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.warn('Failed to decrypt token:', error);
    return null;
  }
}

/**
 * Save OAuth tokens securely in encrypted cookies
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

  // Encrypt and store in cookie
  console.log('🔒 Encrypting tokens...');
  const encryptedTokens = await encrypt(updatedTokens);
  console.log('📝 Getting cookie store...');
  const cookieStore = await cookies();
  
  console.log('🍪 Setting cookie...');
  cookieStore.set(TOKENS_COOKIE, encryptedTokens, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  console.log('✅ OAuth tokens saved successfully to encrypted cookie');
}

/**
 * Load OAuth tokens from encrypted cookies
 */
export async function loadOAuthTokens(): Promise<EtsyOAuthTokens | null> {
  try {
    const cookieStore = await cookies();
    const encryptedTokens = cookieStore.get(TOKENS_COOKIE)?.value;
    
    if (!encryptedTokens) {
      return null;
    }

    const tokens = await decrypt(encryptedTokens);
    return tokens as EtsyOAuthTokens;
  } catch (error) {
    console.warn('Could not load OAuth tokens:', error);
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
 * Save OAuth state for authorization flow in encrypted cookie
 */
export async function saveOAuthState(state: OAuth2State): Promise<void> {
  const encryptedState = await encrypt(state);
  const cookieStore = await cookies();
  
  cookieStore.set(STATE_COOKIE, encryptedState, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });
}

/**
 * Load and validate OAuth state from encrypted cookie
 */
export async function loadAndValidateOAuthState(stateParam: string): Promise<OAuth2State | null> {
  try {
    const cookieStore = await cookies();
    const encryptedState = cookieStore.get(STATE_COOKIE)?.value;
    
    if (!encryptedState) {
      return null;
    }

    const state = await decrypt(encryptedState) as OAuth2State;
    
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
    console.warn('Could not load OAuth state:', error);
    return null;
  }
}

/**
 * Clear OAuth state after use
 */
export async function clearOAuthState(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(STATE_COOKIE);
  } catch (error) {
    console.warn('Could not clear OAuth state:', error);
  }
}

/**
 * Clear all OAuth data (logout)
 */
export async function clearAllOAuthData(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(TOKENS_COOKIE);
    cookieStore.delete(STATE_COOKIE);
    console.log('🗑️ All OAuth data cleared');
  } catch (error) {
    console.warn('Could not clear OAuth data:', error);
  }
}
