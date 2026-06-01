import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

// Lazy initialization of Stripe
let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY no configurada");
    }
    stripe = new Stripe(key, {
      apiVersion: "2026-05-27.dahlia",
    });
  }
  return stripe;
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    const stripeInstance = getStripe();
    
    try {
      event = stripeInstance.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update order status to PAID
        if (session.metadata?.orderId) {
          const orderId = parseInt(session.metadata.orderId);
          
          await prisma.order.update({
            where: { id: orderId },
            data: { 
              status: "PAID",
              stripeId: session.id,
            },
          });

          console.log(`Order ${orderId} marked as PAID`);
        }
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update order status to reflect payment failure
        if (session.metadata?.orderId) {
          const orderId = parseInt(session.metadata.orderId);
          
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "PENDING" },
          });

          console.log(`Order ${orderId} payment failed`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}
