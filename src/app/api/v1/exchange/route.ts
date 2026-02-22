import { NextRequest, NextResponse } from 'next/server';
import { validateCode, consumeCode } from '@/lib/invite-codes.server';

const API_BASE = process.env.API_BASE_URL || 'https://swap-api.zkira.xyz';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Extract and validate invite code
    const { inviteCode, ...exchangeData } = body;
    
    if (!inviteCode) {
      return NextResponse.json({ error: 'Invite code required' }, { status: 403 });
    }
    
    const codeStatus = validateCode(inviteCode);
    if (!codeStatus.valid) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 403 });
    }
    if (codeStatus.used) {
      return NextResponse.json({ error: 'Invite code already used' }, { status: 403 });
    }

    // Build payload for BE (without inviteCode)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || '0.0.0.0';
    const userAgent = request.headers.get('user-agent') || '';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const payload = {
      ...exchangeData,
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
    // Consume the invite code after successful exchange
    consumeCode(inviteCode, data.houdiniId || 'unknown');
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
