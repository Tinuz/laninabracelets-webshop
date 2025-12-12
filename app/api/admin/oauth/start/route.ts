import { NextResponse } from 'next/server';
import { generateOAuthState, generatePKCE, buildEtsyOAuthUrl, REQUIRED_SCOPES } from '@/src/lib/oauth-utils';
import { saveOAuthState } from '@/src/lib/oauth-storage-serverless';

/**
 * Start OAuth flow - redirect admin to Etsy for authorization
 */
export async function GET() {
  try {
    const ETSY_API_KEY = process.env.ETSY_API_KEY;
    if (!ETSY_API_KEY) {
      return NextResponse.json(
        { error: 'ETSY_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Generate OAuth parameters
    const state = generateOAuthState();
    const pkce = generatePKCE();
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/oauth/callback`;
    const scopes = REQUIRED_SCOPES.slice(); // Copy required scopes

    // Save OAuth state for validation
    await saveOAuthState({
      state,
      code_verifier: pkce.verifier,
      code_challenge: pkce.challenge,
      redirect_uri: redirectUri,
      scopes,
      created_at: Date.now(),
    });

    // Build Etsy OAuth URL
    const authUrl = buildEtsyOAuthUrl({
      clientId: ETSY_API_KEY,
      redirectUri,
      scopes,
      state,
      codeChallenge: pkce.challenge,
    });

    // Log for debugging
    console.log('🚀 Starting OAuth flow...');
    console.log('Redirect URI:', redirectUri);
    console.log('Scopes:', scopes);
    console.log('Auth URL:', authUrl.substring(0, 100) + '...');

    // Redirect to Etsy OAuth
    return NextResponse.redirect(authUrl);

  } catch (error) {
    console.error('OAuth start error:', error);
    return NextResponse.json(
      { error: 'Failed to start OAuth flow', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
