/**
 * Cookie Consent Management
 * Handles user preferences for different cookie categories
 */

export type CookieCategory = 'necessary' | 'analytics' | 'marketing';

export interface CookiePreferences {
  necessary: boolean; // Always true, required for site to function
  analytics: boolean; // Google Analytics, etc.
  marketing: boolean; // Future: Facebook Pixel, etc.
  timestamp: number;  // When consent was given
}

const COOKIE_CONSENT_KEY = 'lanina_cookie_consent';
const CONSENT_VERSION = 1; // Increment this to force re-consent

/**
 * Get stored cookie preferences
 */
export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;
    
    const preferences = JSON.parse(stored) as CookiePreferences & { version?: number };
    
    // Check if consent version matches (force re-consent if policy changed)
    if (preferences.version !== CONSENT_VERSION) {
      return null;
    }
    
    return preferences;
  } catch {
    return null;
  }
}

/**
 * Save cookie preferences
 */
export function saveCookiePreferences(preferences: Omit<CookiePreferences, 'necessary' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  const fullPreferences: CookiePreferences & { version: number } = {
    necessary: true, // Always true
    analytics: preferences.analytics,
    marketing: preferences.marketing,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(fullPreferences));
  
  // Dispatch event so other components can react
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
    detail: fullPreferences 
  }));
}

/**
 * Check if user has given consent
 */
export function hasConsent(): boolean {
  return getCookiePreferences() !== null;
}

/**
 * Check if specific category is allowed
 */
export function isCategoryAllowed(category: CookieCategory): boolean {
  const preferences = getCookiePreferences();
  if (!preferences) return false;
  return preferences[category] === true;
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
  saveCookiePreferences({
    analytics: true,
    marketing: true,
  });
}

/**
 * Accept only necessary cookies
 */
export function acceptNecessaryOnly(): void {
  saveCookiePreferences({
    analytics: false,
    marketing: false,
  });
}

/**
 * Withdraw consent (reset preferences)
 */
export function withdrawConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: null }));
}

