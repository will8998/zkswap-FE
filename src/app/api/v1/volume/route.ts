import { NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://swap-api.zkira.xyz';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/volume`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch volume' },
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
