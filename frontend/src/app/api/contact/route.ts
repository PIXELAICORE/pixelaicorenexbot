import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // TODO: Implement contact form handling
  return NextResponse.json({ success: true, received: data });
}
