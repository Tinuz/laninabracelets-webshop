/**
 * OAuth Token Storage System
 * Manages Etsy OAuth tokens securely on the server
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

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

const TOKENS_FILE = join(process.cwd(), '.oauth-tokens.json');
const STATE_FILE = join(process.cwd(), '.oauth-state.json');

/**
 * Save OAuth tokens securely
 */
export function saveOAuthTokens(tokens: Partial<EtsyOAuthTokens>): void {
  const now = Date.now();
  
  let existingTokens: EtsyOAuthTokens | null = null;
  try {
    if (existsSync(TOKENS_FILE)) {
      const data = readFileSync(TOKENS_FILE, 'utf8');
      existingTokens = JSON.parse(data);
    }
  } catch (error) {
    console.warn('Could not read existing tokens:', error);
  }

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

  writeFileSync(TOKENS_FILE, JSON.stringify(updatedTokens, null, 2), 'utf8');
  console.log('✅ OAuth tokens saved successfully');
}

/**
 * Load OAuth tokens
 */
export function loadOAuthTokens(): EtsyOAuthTokens | null {
  try {
    if (!existsSync(TOKENS_FILE)) {
      return null;
    }

    const data = readFileSync(TOKENS_FILE, 'utf8');
    const tokens = JSON.parse(data) as EtsyOAuthTokens;
    
    return tokens;
  } catch (error) {
    console.warn('Could not load OAuth tokens:', error);
    return null;
  }
}

/**
 * Check if tokens are valid (not expired)
 */
export function areTokensValid(): boolean {
  const tokens = loadOAuthTokens();
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
export function hasValidAuthentication(): boolean {
  const tokens = loadOAuthTokens();
  if (!tokens) return false;

  // Either access token is valid, or we have refresh token
  return areTokensValid() || !!tokens.refresh_token;
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = loadOAuthTokens();
  if (!tokens) return null;

  // If current token is still valid, return it
  if (areTokensValid()) {
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
  const tokens = loadOAuthTokens();
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

  saveOAuthTokens(newTokens);
  
  return loadOAuthTokens();
}

/**
 * Save OAuth state for authorization flow
 */
export function saveOAuthState(state: OAuth2State): void {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

/**
 * Load and validate OAuth state
 */
export function loadAndValidateOAuthState(stateParam: string): OAuth2State | null {
  try {
    if (!existsSync(STATE_FILE)) {
      return null;
    }

    const data = readFileSync(STATE_FILE, 'utf8');
    const state = JSON.parse(data) as OAuth2State;
    
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
export function clearOAuthState(): void {
  try {
    if (existsSync(STATE_FILE)) {
      writeFileSync(STATE_FILE, '{}', 'utf8');
    }
  } catch (error) {
    console.warn('Could not clear OAuth state:', error);
  }
}

/**
 * Clear all OAuth data (logout)
 */
export function clearAllOAuthData(): void {
  try {
    if (existsSync(TOKENS_FILE)) {
      writeFileSync(TOKENS_FILE, '{}', 'utf8');
    }
    clearOAuthState();
    console.log('🗑️ All OAuth data cleared');
  } catch (error) {
    console.warn('Could not clear OAuth data:', error);
  }
}
