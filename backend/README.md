Backend scaffolding for Pixel AICore Nexbot

Created files:
- src/api/paypal/create-order.ts
- src/api/paypal/capture-order.ts
- src/api/webhook/paypal.ts
- src/lib/paypal/client.ts

Integration notes:
- Add `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` to backend `.env` for live operations.
- To integrate the new route handlers into the main `server.ts`, import and mount them as middleware:

```js
import createOrderHandler from './src/api/paypal/create-order.js';
import captureOrderHandler from './src/api/paypal/capture-order.js';
import paypalWebhookHandler from './src/api/webhook/paypal.js';

app.post('/api/paypal/create-order', createOrderHandler);
app.post('/api/paypal/capture-order', captureOrderHandler);
app.post('/api/webhook/paypal', express.raw({ type: 'application/json' }), paypalWebhookHandler);
```

- Keep real credentials out of git; use `.env` and ensure `.gitignore` excludes it.
