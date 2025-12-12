import { NextResponse } from 'next/server';
import { testRedisConnection } from '@/src/lib/oauth-storage-redis';

export async function GET() {
  try {
    const isConnected = await testRedisConnection();
    
    return NextResponse.json({
      success: isConnected,
      message: isConnected 
        ? 'Redis connection successful! ✅' 
        : 'Redis connection failed! ❌',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Redis connection error',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
