import Stripe from "stripe";
import { env } from "../config/env.js";
import { UserModel } from "../models/user.model.js";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

export async function createCheckoutSession(userId: string, tier: "pro" | "enterprise") {
  if (!stripe) {
    return { checkoutUrl: null, message: `${tier} checkout is not configured in this environment.` };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price_data: { currency: "usd", product_data: { name: `IntervueX ${tier}` }, unit_amount: tier === "pro" ? 2900 : 9900, recurring: { interval: "month" } }, quantity: 1 }],
    success_url: `${env.APP_URL}/dashboard?billing=success`,
    cancel_url: `${env.APP_URL}/dashboard?billing=cancel`,
    metadata: { userId, tier },
  });

  return { checkoutUrl: session.url, message: "Checkout session created." };
}

export async function syncTierFromStripeCustomer(userId: string, tier: "free" | "pro" | "enterprise") {
  await UserModel.findByIdAndUpdate(userId, { tier });
}
