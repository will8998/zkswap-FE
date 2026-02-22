import { NextRequest, NextResponse } from 'next/server';
import { validateCode } from '@/lib/invite-codes.server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, used: false }, { status: 400 });
    }
    
    const result = validateCode(code);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}