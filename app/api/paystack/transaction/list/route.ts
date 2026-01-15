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

    const searchParams = req.nextUrl.searchParams;
    const perPage = searchParams.get('perPage')
      ? parseInt(searchParams.get('perPage')!)
      : undefined;
    const page = searchParams.get('page')
      ? parseInt(searchParams.get('page')!)
      : undefined;
    const from = searchParams.get('from') || undefined;
    const to = searchParams.get('to') || undefined;
    const status = searchParams.get('status') || undefined;

    // List transactions from Paystack
    const response: any = await paystack.transactions.list({
      perPage,
      page,
      from,
      to,
      status,
    });

    if (response.status && response.data) {
      return new Response(
        JSON.stringify({
          success: true,
          data: response.data,
          meta: response.meta,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    } else {
      return new Response(
        JSON.stringify({
          error: 'Failed to list transactions',
          message: response.message,
        }),
        {status: 400}
      );
    }
  } catch (error: any) {
    console.error('An error occurred when listing Paystack transactions', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {status: 500}
    );
  }
}
