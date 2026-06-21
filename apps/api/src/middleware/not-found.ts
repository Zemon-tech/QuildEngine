import type { Request, Response } from "express";
import { sendError } from "../utils/api-response.js";

export function notFound(req: Request, res: Response) {
  return sendError({
    res,
    statusCode: 404,
    code: "NOT_FOUND",
    message: `Route ${req.method} ${req.path} not found`,
    requestId: req.requestId,
  });
}
