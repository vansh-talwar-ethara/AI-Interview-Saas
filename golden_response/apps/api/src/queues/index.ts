import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { extractResumeText, deriveResumeInsights } from "../services/resume.service.js";

const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

export const resumeQueue = new Queue("resume-jobs", { connection });

export const resumeWorker = new Worker(
  "resume-jobs",
  async (job) => {
    if (job.name === "parse-resume") {
      const { fileBuffer, fileName } = job.data as { fileBuffer: Buffer; fileName: string };
      const rawText = await extractResumeText(fileBuffer, fileName);
      return deriveResumeInsights(rawText);
    }
    return null;
  },
  { connection }
);

resumeWorker.on("failed", (job, error) => {
  logger.error({ jobId: job?.id, error }, "Queue job failed");
});
