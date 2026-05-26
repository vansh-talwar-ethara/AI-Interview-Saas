import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(payload: object) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
}

export function verifyAccessToken<T>(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as T;
}

export function verifyRefreshToken<T>(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as T;
}
