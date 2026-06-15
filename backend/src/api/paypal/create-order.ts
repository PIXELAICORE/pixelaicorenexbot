import type { Request, Response } from 'express';
import { createPayPalOrder } from '../../lib/paypal/client.js';

export default async function createOrderHandler(req: Request, res: Response) {
  try {
    const { amount, currency = 'USD', description } = req.body;
    if (!amount) return res.status(400).json({ error: 'Missing amount' });

    const order: any = await createPayPalOrder({ amount, currency, description });
    return res.json({ orderID: order.id, raw: order });
  } catch (err: any) {
    console.error('create-order error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
