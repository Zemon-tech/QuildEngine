import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger.js";
import { ApiError } from "../utils/api-error.js";
import { sendError } from "../utils/api-response.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    logger.warn({ err, requestId: req.requestId, path: req.path }, err.message);

    return sendError({
      res,
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      details: err.details,
      requestId: req.requestId,
    });
  }

  // Unexpected errors
  logger.error(
    { err, requestId: req.requestId, path: req.path },
    "Unhandled error",
  );

  return sendError({
    res,
    statusCode: 500,
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
    requestId: req.requestId,
  });
}
