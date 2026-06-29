import { useAuthContext } from "../providers/AuthProvider.js";
import { type Permission, hasPermission as checkPermission } from "@quild/contracts";

/**
 * Reusable hook to consume the authentication state in React components.
 * Provides access to the session, user profile, role, permissions, and a helper to check permissions.
 */
export function useAuth() {
  const context = useAuthContext();

  /**
   * Helper to verify if the current authenticated user has a specific permission.
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!context.user) return false;
    return checkPermission(context.user.role, permission);
  };

  return {
    ...context,
    hasPermission,
  };
}
export type UseAuthReturn = ReturnType<typeof useAuth>;
