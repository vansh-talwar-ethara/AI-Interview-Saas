import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async (): Promise<boolean> => {
  const mongoDnsServers =
    env.MONGODB_DNS_SERVERS.length > 0 ? env.MONGODB_DNS_SERVERS : ["1.1.1.1", "8.8.8.8"];

  try {
    if (env.MONGODB_URI.startsWith("mongodb+srv://")) {
      dns.setServers(mongoDnsServers);
      console.log(`MongoDB DNS servers configured: ${mongoDnsServers.join(", ")}`);
    }

    await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB connected successfully at ${new URL(env.MONGODB_URI).host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed for ${env.MONGODB_URI}`);
    console.error(error);
    throw error;
  }
};
