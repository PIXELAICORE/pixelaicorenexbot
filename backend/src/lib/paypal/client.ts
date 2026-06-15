import fetch from 'node-fetch';

const PAYPAL_BASE = process.env.PAYPAL_BASE || 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('PayPal credentials not configured');
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  if (!res.ok) throw new Error('Failed to fetch PayPal access token');
  const text = await res.text();
  // @ts-ignore - parsing dynamic JSON from PayPal API
  let data: any = {};
  try {
    data = JSON.parse(text || '{}');
  } catch (e) {
    data = {};
  }
  return data?.access_token as string;
}

export async function createPayPalOrder({ amount, currency = 'USD', description }: { amount: number | string; currency?: string; description?: string }) {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: currency, value: String(amount) }, description }]
    })
  });
  if (!res.ok) throw new Error('Failed to create PayPal order');
  const data: any = await res.json();
  return data;
}

export async function capturePayPalOrder(orderID: string) {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('Failed to capture PayPal order: ' + text);
  }
  const data: any = await res.json();
  return data;
}

export default { createPayPalOrder, capturePayPalOrder };
