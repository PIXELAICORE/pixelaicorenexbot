import type { Request, Response } from 'express';

export default async function paypalWebhookHandler(req: Request, res: Response) {
  try {
    // Verify webhook signature in production (omitted here)
    const event = req.body;
    console.log('[PAYPAL WEBHOOK] Received event:', event && event.event_type);

    // Basic handling for common events
    if (event?.event_type === 'CHECKOUT.ORDER.APPROVED' || event?.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      // TODO: verify, then record order/payment to Firestore via backend helpers
      console.log('[PAYPAL WEBHOOK] payment completed, id=', event?.resource?.id || event?.resource?.purchase_units?.[0]?.payments);
    }

    res.status(200).send('OK');
  } catch (err: any) {
    console.error('paypal webhook handler error', err);
    res.status(500).send('Webhook handler error');
  }
}
