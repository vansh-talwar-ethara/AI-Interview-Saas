import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

function loadEnvFile() {
  let currentDir = process.cwd();

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidatePath = path.resolve(currentDir, ".env");

    if (fs.existsSync(candidatePath)) {
      dotenv.config({ path: candidatePath });
      return;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  dotenv.config();
}

loadEnvFile();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4002),
  API_URL: z.string().default("http://localhost:4002"),
  APP_URL: z.string().default("http://localhost:3000"),
  MONGODB_URI: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().optional(),
  MONGODB_DNS_SERVERS: z.preprocess((value) => {
    if (typeof value !== "string" || value.trim().length === 0) {
      return [];
    }

    return value
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean);
  }, z.array(z.string().min(1)).default([])),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  OPENAI_API_KEY: z.string().optional(),
  DEEPGRAM_API_KEY: z.string().optional(),
  ELEVENLABS_API_KEY: z.string().optional(),
  JUDGE0_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
