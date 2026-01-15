import {type NextRequest} from 'next/server';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/lib/auth';
import {paystack} from '@/lib/paystack';
import dbConnect from '@/lib/dbConnect';
import Account from '@/app/models/account';

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

    await dbConnect();

    const body = await req.json();
    const {
      business_name,
      settlement_bank,
      account_number,
      percentage_charge,
      description,
      primary_contact_email,
      primary_contact_name,
      primary_contact_phone,
    } = body;

    // Create subaccount on Paystack
    const response: any = await paystack.subaccounts.create({
      business_name: business_name || 'Business',
      settlement_bank: settlement_bank,
      account_number: account_number,
      percentage_charge: percentage_charge || 0,
      description: description,
      primary_contact_email: primary_contact_email || session.user.email,
      primary_contact_name: primary_contact_name,
      primary_contact_phone: primary_contact_phone,
    });

    if (response.status && response.data) {
      // Update user account with Paystack subaccount code
      const user = await Account.findOne({email: session.user.email});
      if (user) {
        user.paystackSubaccountCode = response.data.subaccount_code;
        await user.save();
      }

      return new Response(
        JSON.stringify({
          success: true,
          subaccount: response.data,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    } else {
      return new Response(
        JSON.stringify({
          error: 'Failed to create subaccount',
          message: response.message,
        }),
        {status: 400}
      );
    }
  } catch (error: any) {
    console.error(
      'An error occurred when creating Paystack subaccount',
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
