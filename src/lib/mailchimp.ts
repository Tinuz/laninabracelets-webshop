/**
 * Mailchimp API Client
 * Handles newsletter subscriptions
 */

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

interface SubscribeResult {
  success: boolean;
  message: string;
  error?: string;
}

interface MailchimpError {
  title: string;
  detail: string;
  status: number;
}

/**
 * Subscribe an email to the Mailchimp audience
 */
export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  // Validate environment variables
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_SERVER_PREFIX) {
    console.error('Mailchimp environment variables not configured');
    return {
      success: false,
      message: 'Nieuwsbrief service is tijdelijk niet beschikbaar.',
      error: 'Missing configuration',
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Vul een geldig e-mailadres in.',
      error: 'Invalid email format',
    };
  }

  const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'pending', // Double opt-in (GDPR compliant)
        tags: ['Website', 'Homepage'],
        merge_fields: {
          // You can add more fields here later (first name, etc.)
        },
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Bedankt! Check je inbox om je inschrijving te bevestigen. 📧',
      };
    }

    // Handle specific Mailchimp errors
    const error = data as MailchimpError;
    
    if (error.title === 'Member Exists') {
      return {
        success: false,
        message: 'Je bent al ingeschreven voor onze nieuwsbrief! 💕',
        error: 'Member already exists',
      };
    }

    if (error.title === 'Invalid Resource') {
      return {
        success: false,
        message: 'Dit e-mailadres lijkt niet geldig te zijn.',
        error: error.detail,
      };
    }

    // Generic error
    return {
      success: false,
      message: 'Er ging iets mis. Probeer het later opnieuw.',
      error: error.detail || 'Unknown error',
    };

  } catch (error) {
    console.error('Mailchimp API error:', error);
    return {
      success: false,
      message: 'Er ging iets mis met de verbinding. Probeer het later opnieuw.',
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Check if Mailchimp is properly configured
 */
export function isMailchimpConfigured(): boolean {
  return !!(MAILCHIMP_API_KEY && MAILCHIMP_AUDIENCE_ID && MAILCHIMP_SERVER_PREFIX);
}

