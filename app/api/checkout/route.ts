import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from our .env file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function POST() {
  try {
    // 1. Get the current user's session
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const userId = session.user.id;

    // 2. Define our product (hardcoded for now)
    // In a real app, this would come from a database.
    const productPrice = 2500; // $25.00 in cents
    const productName = "Study App Business Account";
    const productDescription = "Unlock the ability to create and manage your own study spot listing.";

    // 3. Create a Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: productPrice,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // We pass the userId in the metadata so we know who to upgrade after a successful payment
      metadata: {
        userId: userId,
      },
      // These are the URLs Stripe will redirect the user to
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    });

    // 4. Return the URL of the checkout session
    if (!checkoutSession.url) {
        return new NextResponse('Error creating checkout session', { status: 500 });
    }

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}