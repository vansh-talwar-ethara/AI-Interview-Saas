import { Schema, model } from "mongoose";
import type { Tier } from "@intervuex/shared";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, default: "" },
    tier: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    displayName: { type: String, default: "" },
    company: { type: String, default: "" },
    refreshTokenVersion: { type: Number, default: 0 },
    stripeCustomerId: { type: String, default: "" },
  },
  { timestamps: true }
);

export type UserDocument = {
  email: string;
  passwordHash: string;
  tier: Tier;
  displayName: string;
  company: string;
  refreshTokenVersion: number;
  stripeCustomerId: string;
};

export const UserModel = model("User", userSchema);
