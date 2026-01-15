import {type NextRequest} from 'next/server';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/lib/auth';
import {paystack} from '@/lib/paystack';

export async function GET(req: NextRequest) {
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

    // Fetch balance from Paystack
    const response: any = await paystack.balance.fetch();

    if (response.status && response.data) {
      return new Response(
        JSON.stringify({
          success: true,
          balance: response.data,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    } else {
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch balance',
          message: response.message,
        }),
        {status: 400}
      );
    }
  } catch (error: any) {
    console.error('An error occurred when fetching Paystack balance', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {status: 500}
    );
  }
}
