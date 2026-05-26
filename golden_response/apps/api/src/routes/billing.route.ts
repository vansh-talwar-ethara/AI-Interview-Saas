import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { createCheckoutSession, syncTierFromStripeCustomer } from "../services/billing.service.js";

export const billingRouter = Router();

billingRouter.post(
  "/billing/checkout",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const tier = req.body.tier === "enterprise" ? "enterprise" : "pro";
    const session = await createCheckoutSession(req.user!.userId, tier);
    return res.json(success(session));
  })
);

billingRouter.post(
  "/billing/webhook/mock",
  asyncHandler(async (req, res) => {
    const { userId, tier } = req.body as { userId: string; tier: "free" | "pro" | "enterprise" };
    await syncTierFromStripeCustomer(userId, tier);
    return res.json(success({ synced: true }));
  })
);
