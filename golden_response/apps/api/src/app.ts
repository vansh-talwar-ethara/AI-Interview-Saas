import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { sanitizeInput } from "./utils/sanitize.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { healthRouter } from "./routes/health.route.js";
import { authRouter } from "./routes/auth.route.js";
import { interviewsRouter } from "./routes/interviews.route.js";
import { codingRouter } from "./routes/coding.route.js";
import { resumesRouter } from "./routes/resumes.route.js";
import { analyticsRouter } from "./routes/analytics.route.js";
import { billingRouter } from "./routes/billing.route.js";
import { recruiterRouter } from "./routes/recruiter.route.js";
import { aiRouter } from "./routes/ai.route.js";
import { voiceRouter } from "./routes/voice.route.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use((req, _res, next) => {
    req.body = sanitizeInput(req.body) as typeof req.body;
    req.query = sanitizeInput(req.query) as typeof req.query;
    req.params = sanitizeInput(req.params) as typeof req.params;
    next();
  });

  app.use("/api", healthRouter);
  app.use("/api", authRouter);
  app.use("/api", interviewsRouter);
  app.use("/api", codingRouter);
  app.use("/api", resumesRouter);
  app.use("/api", analyticsRouter);
  app.use("/api", billingRouter);
  app.use("/api", recruiterRouter);
  app.use("/api", aiRouter);
  app.use("/api", voiceRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
