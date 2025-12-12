import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/src/lib/mailchimp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'E-mailadres is verplicht.',
        },
        { status: 400 }
      );
    }

    const result = await subscribeToNewsletter(email);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });

  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Er ging iets mis. Probeer het later opnieuw.',
      },
      { status: 500 }
    );
  }
}

