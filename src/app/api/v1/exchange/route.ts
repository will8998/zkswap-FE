import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://swap-api.zkira.xyz';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || '0.0.0.0';
    const userAgent = request.headers.get('user-agent') || '';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      ...body,
      ip,
      userAgent,
      timezone,
    };

    const res = await fetch(`${API_BASE}/api/v1/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text();
      return NextResponse.json(
        { error: errorBody || 'Failed to create exchange' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
