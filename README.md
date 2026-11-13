# orders-payments-api

Orders API that receives the payment result via webhook from a simulated payment provider.
Learning project: NestJS 12, PostgreSQL, JWT, SQS (LocalStack), Docker and CI.

## How to run

```bash
# install dependencies
$ npm install

# development (watch mode)
$ npm run start:dev

# unit tests
$ npm test

# e2e tests
$ npm run test:e2e
```

## Domain

- **Order**: `id`, `userId`, `amount`, `status`, `createdAt`, `updatedAt`
- **PaymentEvent**: `eventId` (UNIQUE), `type`, `orderId`, `payload` (full JSON), `receivedAt`
- **Users**: hardcoded in the code (no table)

## Order states

- `PENDING` → `PAID`: `payment.succeeded` webhook
- `PENDING` → `CANCELLED`: the user cancels the order
- `PAID` → `CANCELLED`: forbidden (a paid order cannot be cancelled)
- `payment.failed` does not change the status; only the event is stored

## Endpoints

| Method | Path                 | Description                                                                        |
| ------ | -------------------- | ---------------------------------------------------------------------------------- |
| POST   | `/auth/login`        | Returns a JWT                                                                      |
| POST   | `/orders`            | Creates an order in `PENDING` (`userId` comes from the JWT)                        |
| GET    | `/orders/:id`        | Returns the order and its status (owner only)                                      |
| POST   | `/orders/:id/cancel` | Cancels the order if it is `PENDING`                                               |
| POST   | `/webhooks/payments` | Called by the provider (simulated from Bruno); HMAC signature in `X-Signature`     |

## Webhook contract

```json
{
  "id": "evt_123",
  "type": "payment.succeeded",
  "createdAt": "2026-01-01T12:00:00.000Z",
  "data": {
    "orderId": "order-id",
    "amount": 100,
    "currency": "USD"
  }
}
```

- `id` is stored as `eventId` (UNIQUE), so a repeated event is not processed twice.
- `type` is `payment.succeeded` or `payment.failed`.
- The request must include the HMAC signature of the body in the `X-Signature` header.

## Out of scope

Products and items, order expiration, creating the payment session with the provider, notifications.

## Known limitations

The amount is sent by the client; in a real system it would be calculated on the server.
