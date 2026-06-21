import type { Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface SuccessOptions<T> {
  res: Response;
  data: T;
  statusCode?: number;
  meta?: Record<string, unknown>;
}

interface PaginatedOptions<T> {
  res: Response;
  data: T[];
  pagination: PaginationMeta;
}

interface ErrorOptions {
  res: Response;
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>[];
  requestId?: string;
}

export function sendSuccess<T>({
  res,
  data,
  statusCode = 200,
  meta,
}: SuccessOptions<T>) {
  return res.status(statusCode).json({
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
}

export function sendPaginated<T>({
  res,
  data,
  pagination,
}: PaginatedOptions<T>) {
  return res.status(200).json({
    data,
    pagination,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
}

export function sendError({
  res,
  statusCode,
  code,
  message,
  details,
  requestId,
}: ErrorOptions) {
  return res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details && { details }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
    },
  });
}

export function sendNoContent(res: Response) {
  return res.status(204).send();
}
