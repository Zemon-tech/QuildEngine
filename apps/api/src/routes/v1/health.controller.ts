import type { Request, Response } from "express";
import { sendSuccess } from "../../utils/api-response.js";

export function getHealth(_req: Request, res: Response) {
  return sendSuccess({
    res,
    data: {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
}
