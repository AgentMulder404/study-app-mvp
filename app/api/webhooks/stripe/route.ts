import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// This is the secret that verifies the webhook is coming from Stripe
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    let event: Stripe.Event;

    // 1. Verify the webhook signature
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.log(`❌ Error message: ${errorMessage}`);
      return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    // 2. Handle the 'checkout.session.completed' event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) {
        console.error('Webhook Error: Missing userId in session metadata.');
        return new NextResponse('Webhook Error: Missing metadata', { status: 400 });
      }

      // 3. Update the user in the database
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isBusiness: true,
        },
      });

      console.log(`✅ Successfully upgraded user ${userId} to a Business Account.`);
    }

    // 4. Acknowledge receipt of the event
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[STRIPE_WEBHOOK_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}