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
    const country = searchParams.get('country') || 'nigeria';

    // List banks from Paystack
    const response: any = await paystack.verification.listBanks({
      country: country,
      perPage: 100,
    });

    if (response.status && response.data) {
      return new Response(
        JSON.stringify({
          success: true,
          banks: response.data,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    } else {
      return new Response(
        JSON.stringify({
          error: 'Failed to list banks',
          message: response.message,
        }),
        {status: 400}
      );
    }
  } catch (error: any) {
    console.error('An error occurred when listing Paystack banks', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {status: 500}
    );
  }
}
