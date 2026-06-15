import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Call backend/paypal capture-order logic
  return NextResponse.json({ success: true, captured: body });
}
