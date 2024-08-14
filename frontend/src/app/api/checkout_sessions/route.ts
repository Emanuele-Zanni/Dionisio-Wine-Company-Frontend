/* // app/api/checkout_sessions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Actualiza la versión a la más reciente esperada o configurada
});

export async function POST(req: NextRequest) {
  try {
    const { cartItems } = await req.json();

    console.log('Received cartItems:', cartItems);

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.imgUrl],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    console.log('Line items:', line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/checkout?success=true`,
      cancel_url: `${req.headers.get('origin')}/checkout?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
} */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const { cartItems, discountPercentage } = await req.json(); 

    console.log('Received cartItems:', cartItems);
    console.log('Received discountPercentage:', discountPercentage);

    if (!cartItems || cartItems.length === 0) {
      console.error('Cart is empty');
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const line_items = cartItems.map((item: any) => {
      const discountedPrice = item.price * (1 - (discountPercentage || 0) / 100);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.imgUrl],
          },
          unit_amount: Math.round(discountedPrice * 100),
        },
        quantity: item.quantity,
      };
    });

    console.log('Line items prepared for Stripe:', line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/checkout?success=true`,
      cancel_url: `${req.headers.get('origin')}/checkout?canceled=true`,
    });

    console.log('Stripe session created:', session);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}