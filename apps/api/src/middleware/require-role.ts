import type { NextFunction, Request, Response } from "express";
import { type Role, type Permission } from "@quild/contracts";
import { ApiError } from "../utils/api-error.js";

/**
 * Middleware factory to enforce required user roles.
 * Returns a 403 Forbidden error if the user's role is not within the allowed set.
 */
export function requireRole(allowedRoles: Role | Role[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden("Access denied: insufficient role privileges"));
    }

    next();
  };
}

/**
 * Middleware factory to enforce required permissions.
 * Returns a 403 Forbidden error if the user's role lacks the specified permission.
 */
export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!req.user.permissions.includes(permission)) {
      return next(ApiError.forbidden(`Access denied: missing required permission '${permission}'`));
    }

    next();
  };
}
