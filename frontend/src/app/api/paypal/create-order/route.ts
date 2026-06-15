import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Call backend/paypal create-order logic
  return NextResponse.json({ orderID: 'PLACEHOLDER_ORDER_ID', received: body });
}
