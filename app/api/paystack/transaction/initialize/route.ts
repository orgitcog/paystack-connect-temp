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
    const {
      email,
      amount,
      currency,
      reference,
      callback_url,
      metadata,
      channels,
      subaccount,
    } = body;

    // Initialize transaction on Paystack
    const response: any = await paystack.transactions.initialize({
      email: email || session.user.email,
      amount: amount, // Amount in kobo (smallest currency unit)
      currency: currency || 'NGN',
      reference: reference,
      callback_url: callback_url,
      metadata: metadata,
      channels: channels,
      subaccount: subaccount,
    });

    if (response.status && response.data) {
      return new Response(
        JSON.stringify({
          success: true,
          authorization_url: response.data.authorization_url,
          access_code: response.data.access_code,
          reference: response.data.reference,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    } else {
      return new Response(
        JSON.stringify({
          error: 'Failed to initialize transaction',
          message: response.message,
        }),
        {status: 400}
      );
    }
  } catch (error: any) {
    console.error(
      'An error occurred when initializing Paystack transaction',
      error
    );
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {status: 500}
    );
  }
}
