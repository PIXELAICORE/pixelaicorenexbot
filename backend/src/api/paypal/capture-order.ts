import type { Request, Response } from 'express';
import { capturePayPalOrder } from '../../lib/paypal/client.js';

export default async function captureOrderHandler(req: Request, res: Response) {
  try {
    const { orderID } = req.body;
    if (!orderID) return res.status(400).json({ error: 'Missing orderID' });

    const capture = await capturePayPalOrder(orderID);
    return res.json({ success: true, capture });
  } catch (err: any) {
    console.error('capture-order error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
