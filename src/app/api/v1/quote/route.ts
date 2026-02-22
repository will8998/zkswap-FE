import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://swap-api.zkira.xyz';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const amount = searchParams.get('amount');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const anonymous = searchParams.get('anonymous') ?? 'false';

    if (!amount || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters: amount, from, to' },
        { status: 400 }
      );
    }

    const url = `${API_BASE}/api/v1/quote?amount=${encodeURIComponent(amount)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&anonymous=${encodeURIComponent(anonymous)}`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: body || 'Failed to fetch quote' },
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
