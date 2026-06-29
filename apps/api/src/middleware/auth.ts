import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { normalizeRole, ROLE_PERMISSIONS, type Role, type Permission } from "@quild/contracts";
import { ApiError } from "../utils/api-error.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        permissions: Permission[];
      };
    }
  }
}

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  app_metadata?: {
    role?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Authentication middleware that verifies the incoming request's Supabase JWT.
 * Verifies the JWT signature locally using the project's JWT_SECRET (HS256).
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Authentication required: missing or invalid scheme"));
  }

  const token = authHeader.substring(7); // "Bearer " is 7 chars
  if (!token) {
    return next(ApiError.unauthorized("Authentication required: token missing"));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as SupabaseJwtPayload;

    if (!decoded.sub) {
      return next(ApiError.unauthorized("Invalid token payload: missing sub claim"));
    }

    const email = decoded.email || "";
    const roleString = decoded.app_metadata?.role || "learner";
    
    // Normalize role string from JWT into centralized types
    const role = normalizeRole(roleString);
    const permissions = ROLE_PERMISSIONS[role] || [];

    req.user = {
      id: decoded.sub,
      email,
      role,
      permissions,
    };

    next();
  } catch (error) {
    return next(ApiError.unauthorized("Invalid or expired session token"));
  }
}
