import {type NextRequest} from 'next/server';
import crypto from 'crypto';

/**
 * Paystack Webhook Handler
 * This endpoint receives webhook events from Paystack
 * and processes them accordingly
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify webhook signature
    if (!signature) {
      console.error('No signature provided');
      return new Response(JSON.stringify({error: 'No signature provided'}), {
        status: 400,
      });
    }

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid signature');
      return new Response(JSON.stringify({error: 'Invalid signature'}), {
        status: 400,
      });
    }

    // Parse the event
    const event = JSON.parse(body);

    console.log('Paystack webhook event received:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;
      case 'transfer.success':
        await handleTransferSuccess(event.data);
        break;
      case 'transfer.failed':
        await handleTransferFailed(event.data);
        break;
      case 'transfer.reversed':
        await handleTransferReversed(event.data);
        break;
      case 'customeridentification.success':
        await handleCustomerIdentificationSuccess(event.data);
        break;
      case 'customeridentification.failed':
        await handleCustomerIdentificationFailed(event.data);
        break;
      case 'paymentrequest.pending':
        await handlePaymentRequestPending(event.data);
        break;
      case 'paymentrequest.success':
        await handlePaymentRequestSuccess(event.data);
        break;
      case 'subscription.create':
        await handleSubscriptionCreate(event.data);
        break;
      case 'subscription.disable':
        await handleSubscriptionDisable(event.data);
        break;
      case 'invoice.create':
        await handleInvoiceCreate(event.data);
        break;
      case 'invoice.update':
        await handleInvoiceUpdate(event.data);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data);
        break;
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return new Response(JSON.stringify({received: true}), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error: any) {
    console.error('Error processing Paystack webhook:', error);
    return new Response(JSON.stringify({error: 'Webhook processing failed'}), {
      status: 500,
    });
  }
}

/**
 * Event handlers
 */

async function handleChargeSuccess(data: any) {
  console.log('Charge successful:', data.reference);
  // TODO: Update order status, send confirmation email, etc.
}

async function handleTransferSuccess(data: any) {
  console.log('Transfer successful:', data.transfer_code);
  // TODO: Update payout status in database
}

async function handleTransferFailed(data: any) {
  console.log('Transfer failed:', data.transfer_code);
  // TODO: Notify user, update status in database
}

async function handleTransferReversed(data: any) {
  console.log('Transfer reversed:', data.transfer_code);
  // TODO: Update balance, notify user
}

async function handleCustomerIdentificationSuccess(data: any) {
  console.log('Customer identification successful:', data.customer_code);
  // TODO: Update customer verification status
}

async function handleCustomerIdentificationFailed(data: any) {
  console.log('Customer identification failed:', data.customer_code);
  // TODO: Notify user to retry verification
}

async function handlePaymentRequestPending(data: any) {
  console.log('Payment request pending:', data.id);
  // TODO: Update payment request status
}

async function handlePaymentRequestSuccess(data: any) {
  console.log('Payment request successful:', data.id);
  // TODO: Update payment request status, fulfill order
}

async function handleSubscriptionCreate(data: any) {
  console.log('Subscription created:', data.subscription_code);
  // TODO: Update subscription status in database
}

async function handleSubscriptionDisable(data: any) {
  console.log('Subscription disabled:', data.subscription_code);
  // TODO: Update subscription status, send notification
}

async function handleInvoiceCreate(data: any) {
  console.log('Invoice created:', data.id);
  // TODO: Send invoice to customer
}

async function handleInvoiceUpdate(data: any) {
  console.log('Invoice updated:', data.id);
  // TODO: Update invoice in database
}

async function handleInvoicePaymentFailed(data: any) {
  console.log('Invoice payment failed:', data.id);
  // TODO: Notify customer, retry payment
}
