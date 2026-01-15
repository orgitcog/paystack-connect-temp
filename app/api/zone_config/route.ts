import {NextResponse} from 'next/server';
import {getZoneConfig} from '@/lib/zoneConfig';

/**
 * Public endpoint to fetch zone configuration
 * This is intentionally public as it contains branding and terminology
 * that must be accessible before authentication.
 * No sensitive data should be included in zone config files.
 */
export async function GET() {
  try {
    const config = getZoneConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Failed to load zone config:', error);
    return NextResponse.json(
      {error: 'Failed to load configuration'},
      {status: 500}
    );
  }
}
