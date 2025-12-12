import { NextResponse } from 'next/server';
import { loadOAuthTokens, areTokensValid, hasValidAuthentication } from '@/src/lib/oauth-storage';

/**
 * Check OAuth authentication status
 */
export async function GET() {
  try {
    const tokens = loadOAuthTokens();
    const isValid = areTokensValid();
    const hasAuth = hasValidAuthentication();

    return NextResponse.json({
      authenticated: hasAuth,
      hasTokens: !!tokens,
      tokenValid: isValid,
      hasRefreshToken: !!tokens?.refresh_token,
      userId: tokens?.user_id,
      scopes: tokens?.scopes || [],
      expiresAt: tokens?.expires_at,
      updatedAt: tokens?.updated_at,
    });
  } catch (error) {
    console.error('OAuth status error:', error);
    return NextResponse.json(
      { error: 'Failed to check OAuth status' },
      { status: 500 }
    );
  }
}

/**
 * Logout - clear OAuth tokens
 */
export async function DELETE() {
  try {
    const { clearAllOAuthData } = await import('@/src/lib/oauth-storage');
    clearAllOAuthData();
    
    return NextResponse.json({ success: true, message: 'OAuth tokens cleared' });
  } catch (error) {
    console.error('OAuth logout error:', error);
    return NextResponse.json(
      { error: 'Failed to clear tokens' },
      { status: 500 }
    );
  }
}
