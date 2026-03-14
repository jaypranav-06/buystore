# PayPal REST API Integration

## Overview
This project uses the official PayPal REST API v2 for payment processing. The integration supports both sandbox (testing) and live (production) modes.

## Setup Instructions

### 1. Get PayPal Credentials

**For Testing (Sandbox):**
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in with your PayPal account
3. Navigate to "Apps & Credentials"
4. Under "Sandbox", click "Create App"
5. Copy your **Client ID** and **Secret**

**For Production (Live):**
1. Switch to "Live" mode in the PayPal Developer Dashboard
2. Create a live app
3. Copy your **Live Client ID** and **Secret**

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="sandbox"  # Use "live" for production
```

**Important:**
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - This is exposed to the browser (needed for PayPal buttons)
- `PAYPAL_CLIENT_SECRET` - This is kept secret on the server side
- `PAYPAL_MODE` - Set to "sandbox" for testing, "live" for production

### 3. Install Dependencies

The PayPal integration requires the following package:

```bash
npm install @paypal/react-paypal-js
```

This is already included in `package.json`.

## How It Works

### Payment Flow

1. **User adds items to cart** and proceeds to checkout
2. **User fills shipping information**
3. **PayPal button is displayed** on payment step
4. **User clicks PayPal button**:
   - Frontend calls `/api/payments/paypal/create-order`
   - Backend creates a PayPal order and returns order ID
   - User is redirected to PayPal to complete payment
5. **User approves payment on PayPal**
6. **Payment is captured**:
   - Order is created in our database
   - Backend calls `/api/payments/paypal/capture-order`
   - PayPal payment is captured
   - Order status is updated to "completed"
7. **User sees confirmation** page

### API Endpoints

#### 1. Create PayPal Order
**Endpoint:** `POST /api/payments/paypal/create-order`

**Request Body:**
```json
{
  "amount": 100.00,
  "currency": "USD",
  "items": [
    {
      "name": "Product Name",
      "quantity": 2,
      "unit_amount": 50.00
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "paypal_order_id": "PAYPAL-ORDER-ID",
  "approve_url": "https://paypal.com/approve/...",
  "status": "CREATED"
}
```

#### 2. Capture PayPal Payment
**Endpoint:** `POST /api/payments/paypal/capture-order`

**Request Body:**
```json
{
  "paypal_order_id": "PAYPAL-ORDER-ID",
  "internal_order_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "transaction_id": "TRANSACTION-ID",
  "capture_status": "COMPLETED",
  "paypal_data": {
    "id": "order-id",
    "status": "COMPLETED",
    "payer": {
      "email": "buyer@example.com",
      "name": "John Doe"
    }
  },
  "order": { ... },
  "message": "Payment captured successfully"
}
```

## Code Structure

### Backend Files

1. **`/lib/services/paypal.ts`** - PayPal service utility
   - `getPayPalConfig()` - Get configuration from environment
   - `getPayPalAccessToken()` - OAuth 2.0 authentication
   - `createPayPalOrder()` - Create order via PayPal API
   - `capturePayPalOrder()` - Capture payment
   - `getPayPalOrderDetails()` - Get order details
   - `extractTransactionDetails()` - Parse transaction data
   - `getApproveLink()` - Get approval URL

2. **`/app/api/payments/paypal/create-order/route.ts`** - Create order endpoint
   - Authenticates with PayPal
   - Creates order using REST API v2
   - Returns order ID and approval URL

3. **`/app/api/payments/paypal/capture-order/route.ts`** - Capture payment endpoint
   - Captures the payment
   - Updates order in database
   - Returns transaction details

### Frontend Files

1. **`/app/checkout/page.tsx`** - Checkout page
   - Integrates PayPal buttons
   - Handles payment flow
   - Shows confirmation

## Testing

### Test with Sandbox

1. Set `PAYPAL_MODE="sandbox"` in `.env`
2. Use PayPal sandbox credentials
3. Go to checkout and click PayPal button
4. Log in with a [sandbox buyer account](https://developer.paypal.com/dashboard/accounts)
5. Complete the test payment

### Sandbox Test Accounts

Create test accounts in [PayPal Sandbox Accounts](https://developer.paypal.com/dashboard/accounts):
- **Personal Account** - Acts as the buyer
- **Business Account** - Acts as the seller (this is you)

## Security Features

1. **OAuth 2.0 Authentication** - Secure token-based authentication
2. **Secret Keys** - Client secret is never exposed to browser
3. **HTTPS Required** - PayPal requires HTTPS in production
4. **Transaction Verification** - All payments are verified server-side

## Going Live

When you're ready to accept real payments:

1. Get approved by PayPal for live processing
2. Create a live app in PayPal Developer Dashboard
3. Update environment variables:
   ```env
   PAYPAL_MODE="live"
   NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-live-client-id"
   PAYPAL_CLIENT_SECRET="your-live-secret"
   ```
4. Test thoroughly with small amounts first

## Troubleshooting

### Common Issues

**"PayPal credentials not configured"**
- Solution: Make sure `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set in `.env`

**"PayPal authentication failed"**
- Solution: Check that your client ID and secret are correct
- Solution: Verify you're using sandbox credentials with `PAYPAL_MODE="sandbox"`

**"Failed to create PayPal order"**
- Solution: Check the server logs for detailed error message
- Solution: Verify the amount is a valid number

**PayPal button not showing**
- Solution: Check browser console for errors
- Solution: Verify `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set correctly
- Solution: Clear cache and rebuild: `rm -rf .next && npm run dev`

## References

- [PayPal REST API Documentation](https://developer.paypal.com/api/rest/)
- [PayPal Orders API](https://developer.paypal.com/docs/api/orders/v2/)
- [PayPal React SDK](https://www.npmjs.com/package/@paypal/react-paypal-js)
- [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)

## Support

For PayPal-specific issues, consult the [PayPal Developer Community](https://www.paypal-community.com/t5/Developer-Community/ct-p/developer).
