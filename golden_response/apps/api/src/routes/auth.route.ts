import { Router } from "express";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { failure, success } from "../utils/apiResponse.js";
import { UserModel } from "../models/user.model.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { env } from "../config/env.js";

type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  tier: string;
};

function buildSession(user: { id: string; email: string; displayName: string; tier: string }) {
  const payload = {
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
    tier: user.tier,
  };

  return {
    user,
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

async function verifyGoogleCredential(credential: string) {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  if (!response.ok) {
    throw new Error("Invalid Google credential");
  }

  const tokenInfo = (await response.json()) as {
    aud?: string;
    email?: string;
    email_verified?: string;
    name?: string;
    given_name?: string;
  };

  if (tokenInfo.aud !== env.GOOGLE_CLIENT_ID) {
    throw new Error("Google credential audience mismatch");
  }

  if (tokenInfo.email_verified !== "true" || !tokenInfo.email) {
    throw new Error("Google email is not verified");
  }

  return {
    email: tokenInfo.email.toLowerCase(),
    displayName: tokenInfo.name?.trim() || tokenInfo.given_name?.trim() || tokenInfo.email.split("@")[0],
  };
}

export const authRouter = Router();

authRouter.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const { email, password, displayName } = req.body as { email?: string; password?: string; displayName?: string };
    if (!email || !password) {
      const response = failure("Email and password are required", "VALIDATION_ERROR", 400);
      return res.status(response.statusCode).json(response.body);
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser && existingUser.passwordHash) {
      const response = failure("Email is already registered", "AUTH_CONFLICT", 409);
      return res.status(response.statusCode).json(response.body);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    let user =
      existingUser ??
      (await UserModel.create({ email: normalizedEmail, passwordHash, displayName: displayName ?? email.split("@")[0] }));

    if (existingUser) {
      existingUser.passwordHash = passwordHash;
      existingUser.displayName = displayName || existingUser.displayName || email.split("@")[0];
      await existingUser.save();
      user = existingUser;
    }

    return res.status(201).json(success(buildSession({ id: user.id, email: user.email, displayName: user.displayName, tier: user.tier })));
  })
);

authRouter.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    const user = await UserModel.findOne({ email: email?.toLowerCase() ?? "" });
    if (!user) {
      const response = failure("Invalid credentials", "AUTH_INVALID", 401);
      return res.status(response.statusCode).json(response.body);
    }

    const valid = await bcrypt.compare(password ?? "", user.passwordHash);
    if (!valid) {
      const response = failure("Invalid credentials", "AUTH_INVALID", 401);
      return res.status(response.statusCode).json(response.body);
    }

    return res.json(success(buildSession({ id: user.id, email: user.email, displayName: user.displayName, tier: user.tier })));
  })
);

authRouter.post(
  "/auth/oauth/google",
  asyncHandler(async (req, res) => {
    const { credential } = req.body as { credential?: string };
    if (!credential) {
      const response = failure("Google credential is required", "VALIDATION_ERROR", 400);
      return res.status(response.statusCode).json(response.body);
    }

    if (!env.GOOGLE_CLIENT_ID) {
      const response = failure("Google OAuth is not configured", "CONFIG_ERROR", 503);
      return res.status(response.statusCode).json(response.body);
    }

    let googleProfile: { email: string; displayName: string };
    try {
      googleProfile = await verifyGoogleCredential(credential);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google sign in failed";
      const response = failure(message, "AUTH_INVALID", 401);
      return res.status(response.statusCode).json(response.body);
    }

    const existingUser = await UserModel.findOne({ email: googleProfile.email });
    const user = existingUser ?? (await UserModel.create({ email: googleProfile.email, passwordHash: "", displayName: googleProfile.displayName }));

    if (existingUser && !existingUser.displayName) {
      existingUser.displayName = googleProfile.displayName;
      await existingUser.save();
    }

    return res.json(success(buildSession({ id: user.id, email: user.email, displayName: user.displayName || googleProfile.displayName, tier: user.tier })));
  })
);

authRouter.get(
  "/auth/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await UserModel.findById(req.user!.userId);
    if (!user) {
      const response = failure("User not found", "AUTH_INVALID", 404);
      return res.status(response.statusCode).json(response.body);
    }

    return res.json(success({ id: user.id, email: user.email, displayName: user.displayName, tier: user.tier }));
  })
);

authRouter.post(
  "/auth/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) {
      const response = failure("Refresh token required", "VALIDATION_ERROR", 400);
      return res.status(response.statusCode).json(response.body);
    }

    const decoded = verifyRefreshToken<{ userId: string; tier: string }>(refreshToken);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      const response = failure("User not found", "AUTH_INVALID", 404);
      return res.status(response.statusCode).json(response.body);
    }

    return res.json(
      success(
        buildSession({
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          tier: user.tier,
        })
      )
    );
  })
);

authRouter.post(
  "/auth/logout",
  requireAuth,
  asyncHandler(async (_req, res) => {
    return res.json(success({ loggedOut: true }));
  })
);
