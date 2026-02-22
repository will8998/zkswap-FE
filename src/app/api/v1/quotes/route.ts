import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://swap-api.zkira.xyz';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const amount = searchParams.get('amount');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!amount || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters: amount, from, to' },
        { status: 400 }
      );
    }

    const baseParams = `amount=${encodeURIComponent(amount)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

    // Fetch standard + private quotes in parallel
    const [standardRes, privateRes] = await Promise.allSettled([
      fetch(`${API_BASE}/api/v1/quote?${baseParams}&anonymous=false`, { cache: 'no-store' }),
      fetch(`${API_BASE}/api/v1/quote?${baseParams}&anonymous=true`, { cache: 'no-store' }),
    ]);

    const routes: Array<Record<string, unknown>> = [];

    // Standard (No Wallet Connect) route
    if (standardRes.status === 'fulfilled' && standardRes.value.ok) {
      const data = await standardRes.value.json();
      routes.push({
        ...data,
        routeType: 'standard',
        routeLabel: 'No Wallet Connect',
      });
    }

    // Private route (XMR-routed)
    if (privateRes.status === 'fulfilled' && privateRes.value.ok) {
      const data = await privateRes.value.json();
      routes.push({
        ...data,
        routeType: 'private',
        routeLabel: 'Private',
      });
    }

    if (routes.length === 0) {
      return NextResponse.json(
        { error: 'No routes available for this pair' },
        { status: 404 }
      );
    }

    // Sort by amountOut descending (best rate first)
    routes.sort((a, b) => (b.amountOut as number) - (a.amountOut as number));

    // Calculate percentage difference relative to best route
    const bestAmountOut = routes[0].amountOut as number;
    for (const route of routes) {
      const diff = ((route.amountOut as number) - bestAmountOut) / bestAmountOut * 100;
      route.percentDiff = Math.round(diff * 100) / 100;
    }

    return NextResponse.json(routes);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
