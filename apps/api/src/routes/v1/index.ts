import { Router } from "express";
import { getHealth } from "./health.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { getMe } from "../../modules/auth/auth.controller.js";

const v1Router = Router();

// Health check
v1Router.get("/health", getHealth);

// Authentication
v1Router.get("/auth/me", authMiddleware, getMe);
v1Router.post("/auth/me", authMiddleware, getMe);

export { v1Router };
