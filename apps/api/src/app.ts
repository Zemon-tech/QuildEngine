import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import { requestId } from "./middleware/request-id.js";
import { v1Router } from "./routes/v1/index.js";

const app = express();

// Security headers
app.use(helmet());

// Request ID
app.use(requestId);

// Request logging
app.use(
  pinoHttp({
    logger,
    customProps(req) {
      return { requestId: req.requestId };
    },
  }),
);

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  }),
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/v1", v1Router);

// 404 handler (must be after routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

export { app };
