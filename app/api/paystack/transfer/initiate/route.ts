import {type NextRequest} from 'next/server';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/lib/auth';
import {paystack} from '@/lib/paystack';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({
          error: 'Not authenticated',
        }),
        {status: 401}
      );
    }

    const body = await req.json();
    const {source, amount, recipient, reason, currency, reference} = body;

    // Initiate transfer on Paystack
    const response: any = await paystack.transfers.initiate({
      source: source || 'balance',
      amount: amount, // Amount in kobo
      recipient: recipient,
      reason: reason,
      currency: currency || 'NGN',
      reference: reference,
    });

    if (response.status && response.data) {
      return new Response(
        JSON.stringify({
          success: true,
          transfer: response.data,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    } else {
      return new Response(
        JSON.stringify({
          error: 'Failed to initiate transfer',
          message: response.message,
        }),
        {status: 400}
      );
    }
  } catch (error: any) {
    console.error('An error occurred when initiating Paystack transfer', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {status: 500}
    );
  }
}
