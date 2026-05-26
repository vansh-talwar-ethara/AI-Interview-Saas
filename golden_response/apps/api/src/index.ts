import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { attachSocketHandlers } from "./socket.js";

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: env.APP_URL, credentials: true },
  });

  attachSocketHandlers(io);

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "IntervueX API listening");
  });
}

void bootstrap().catch((error) => {
  logger.error({ error }, "API bootstrap failed");
  process.exit(1);
});
