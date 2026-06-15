import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // TODO: Implement auth routing for login/register actions
  return NextResponse.json({ success: true, received: data });
}
