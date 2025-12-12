import { NextRequest, NextResponse } from 'next/server';
import { loadAndValidateOAuthState, clearOAuthState, saveOAuthTokens } from '@/src/lib/oauth-storage-redis';
import { exchangeCodeForTokens } from '@/src/lib/oauth-utils';

/**
 * OAuth callback - handle authorization code and exchange for tokens
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/admin/oauth/error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`, request.url)
      );
    }

    // Validate required parameters
    if (!code || !state) {
      console.error('Missing OAuth parameters:', { code: !!code, state: !!state });
      return NextResponse.redirect(
        new URL('/admin/oauth/error?error=missing_parameters', request.url)
      );
    }

    // Validate state and get OAuth parameters
    const oauthState = await loadAndValidateOAuthState(state);
    if (!oauthState) {
      console.error('Invalid OAuth state');
      return NextResponse.redirect(
        new URL('/admin/oauth/error?error=invalid_state', request.url)
      );
    }

    const ETSY_API_KEY = process.env.ETSY_API_KEY;
    if (!ETSY_API_KEY) {
      throw new Error('ETSY_API_KEY not configured');
    }

    // Exchange authorization code for tokens
    console.log('🔄 Exchanging authorization code for tokens...');
    const tokens = await exchangeCodeForTokens({
      code,
      clientId: ETSY_API_KEY,
      redirectUri: oauthState.redirect_uri,
      codeVerifier: oauthState.code_verifier,
    });

    // Save tokens
    console.log('🔄 Saving OAuth tokens...');
    await saveOAuthTokens({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
      token_type: tokens.token_type,
      scopes: oauthState.scopes,
    });
    console.log('✅ Tokens saved');

    // Clear OAuth state
    await clearOAuthState();
    console.log('🧹 OAuth state cleared');

    console.log('✅ OAuth flow completed successfully');
    
    // Redirect to success page
    return NextResponse.redirect(
      new URL('/admin/oauth/success', request.url)
    );

  } catch (error) {
    console.error('OAuth callback error:', error);
    await clearOAuthState(); // Clean up on error
    
    return NextResponse.redirect(
      new URL(`/admin/oauth/error?error=token_exchange_failed&description=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`, request.url)
    );
  }
}
