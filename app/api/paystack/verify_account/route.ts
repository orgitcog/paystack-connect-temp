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
    const accountNumber = searchParams.get('account_number');
    const bankCode = searchParams.get('bank_code');

    if (!accountNumber || !bankCode) {
      return new Response(
        JSON.stringify({
          error: 'Missing account_number or bank_code',
        }),
        {status: 400}
      );
    }

    // Verify account with Paystack
    const response: any = await paystack.verification.resolveAccount({
      account_number: accountNumber,
      bank_code: bankCode,
    });

    if (response.status && response.data) {
      return new Response(
        JSON.stringify({
          success: true,
          accountName: response.data.account_name,
          accountNumber: response.data.account_number,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    } else {
      return new Response(
        JSON.stringify({
          error: 'Failed to verify account',
          message: response.message,
        }),
        {status: 400}
      );
    }
  } catch (error: any) {
    console.error('An error occurred when verifying Paystack account', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {status: 500}
    );
  }
}
