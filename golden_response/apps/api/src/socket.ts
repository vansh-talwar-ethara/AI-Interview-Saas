import type { Server } from "socket.io";
import { logger } from "./config/logger.js";

export function attachSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    socket.on("join-session", ({ sessionId }) => {
      socket.join(sessionId);
      socket.data.sessionId = sessionId;
    });

    socket.on("voice-transcript", ({ sessionId, transcript }) => {
      socket.to(sessionId).emit("voice-transcript", transcript);
    });

    socket.on("code-sync", ({ sessionId, content }) => {
      socket.to(sessionId).emit("code-sync", content);
    });

    socket.on("interrupt-tts", ({ sessionId }) => {
      socket.to(sessionId).emit("interrupt-tts");
    });

    socket.on("leave-session", ({ sessionId }) => {
      socket.leave(sessionId);
    });

    socket.on("disconnect", () => {
      const sessionId = socket.data.sessionId as string | undefined;
      if (sessionId) {
        socket.leave(sessionId);
        socket.to(sessionId).emit("participant-left", { socketId: socket.id });
      }
      logger.info({ socketId: socket.id }, "Socket disconnected");
    });
  });
}
