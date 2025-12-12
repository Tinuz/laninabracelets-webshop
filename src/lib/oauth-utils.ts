/**
 * OAuth 2.0 Utilities
 * PKCE and state generation for secure OAuth flow
 */

import { createHash, randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure random string
 */
export function generateRandomString(length: number = 32): string {
  return randomBytes(length).toString('base64url');
}

/**
 * Generate OAuth 2.0 state parameter (CSRF protection)
 */
export function generateOAuthState(): string {
  return generateRandomString(32);
}

/**
 * Generate PKCE code verifier
 * As per RFC 7636, should be 43-128 characters
 */
export function generateCodeVerifier(): string {
  return generateRandomString(32); // This creates ~43 characters in base64url
}

/**
 * Generate PKCE code challenge from verifier
 * Uses SHA256 and base64url encoding
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = createHash('sha256');
  hash.update(verifier);
  return hash.digest('base64url');
}

/**
 * Generate complete PKCE pair
 */
export function generatePKCE(): { verifier: string; challenge: string } {
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  
  return { verifier, challenge };
}

/**
 * Build Etsy OAuth authorization URL
 */
export function buildEtsyOAuthUrl(params: {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  state: string;
  codeChallenge: string;
}): string {
  const baseUrl = 'https://www.etsy.com/oauth/connect';
  
  const urlParams = new URLSearchParams({
    response_type: 'code',
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    scope: params.scopes.join(' '),
    state: params.state,
    code_challenge: params.codeChallenge,
    code_challenge_method: 'S256',
  });

  return `${baseUrl}?${urlParams.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForTokens(params: {
  code: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}> {
  const response = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: params.clientId,
      code: params.code,
      redirect_uri: params.redirectUri,
      code_verifier: params.codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${error}`);
  }

  return await response.json();
}

/**
 * Validate required scopes for La Nina Bracelets
 */
export const REQUIRED_SCOPES = [
  'shops_r',    // Read shop information
  'listings_r', // Read listings/products
] as const;

export function validateScopes(scopes: string[]): boolean {
  return REQUIRED_SCOPES.every(required => scopes.includes(required));
}

/**
 * Get scope descriptions for UI
 */
export const SCOPE_DESCRIPTIONS = {
  'shops_r': 'Bekijk winkelinformatie',
  'listings_r': 'Bekijk producten en collecties',
  'shops_w': 'Bewerk winkelinformatie',
  'listings_w': 'Bewerk producten',
} as const;
