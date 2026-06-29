import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { sendSuccess } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";

/**
 * Controller to handle current user session retrieval.
 * Returns the decoded JWT user info, verified role/permissions, and DB profile.
 */
export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    const { id, email, role, permissions } = req.user;

    // Get DB profile (or create on first call)
    const profile = await AuthService.getOrCreateProfile(id, email);

    return sendSuccess({
      res,
      data: {
        user: {
          id,
          email,
          role,
          permissions,
        },
        profile,
      },
    });
  } catch (error: any) {
    next(ApiError.internal(`Failed to fetch user state: ${error.message}`));
  }
}
