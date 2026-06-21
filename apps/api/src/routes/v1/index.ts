import { Router } from "express";
import { getHealth } from "./health.controller.js";

const v1Router = Router();

// Health check
v1Router.get("/health", getHealth);

export { v1Router };
