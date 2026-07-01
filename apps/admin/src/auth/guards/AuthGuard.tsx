import React from "react";
import { useAuth } from "../hooks/useAuth.js";
import { type Role, type Permission } from "@quild/contracts";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { Spinner } from "#/components/ui/spinner.js";
import { Shield } from "lucide-react";

/**
 * AuthGuard ensures that only authenticated users can access the nested routes/components.
 * Redirects unauthenticated users to /login and preserves their target URL.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { authenticated, loading } = useAuth();
  const routerState = useRouterState();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Spinner className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Navigate
        to={"/admin/login" as any}
        search={{ redirect: routerState.location.href } as any}
        replace
      />
    );
  }

  return <>{children}</>;
}

/**
 * RoleGuard restricts rendering to specific roles.
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!user || !role || !allowedRoles.includes(role)) {
    return (
      <>
        {fallback || (
          <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed rounded-xl gap-3">
            <h3 className="font-bold text-lg text-foreground">Access Restricted</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your role ({role || "guest"}) does not have permission to access this resource.
            </p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}

/**
 * PermissionGuard restricts rendering based on fine-grained permissions.
 */
export function PermissionGuard({
  children,
  permission,
  fallback,
}: {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}) {
  const { hasPermission, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!hasPermission(permission)) {
    return (
      <>
        {fallback || (
          <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed rounded-xl gap-3">
            <h3 className="font-bold text-lg text-destructive font-medium">Permission Required</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              This action requires the `{permission}` permission.
            </p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}

/**
 * GuestGuard prevents authenticated users from accessing auth-only pages like /login.
 * Redirects them to the dashboard.
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
}

/**
 * AdminGuard restricts access to administrative roles.
 */
export function AdminGuard({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user, role, loading } = useAuth();
  const ADMIN_ROLES: Role[] = ["admin", "moderator"];

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Spinner className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user || !role || !ADMIN_ROLES.includes(role)) {
    return (
      <>
        {fallback || (
          <div className="flex flex-col items-center justify-center text-center p-12 h-screen w-screen bg-zinc-950 text-zinc-200 gap-4">
            <Shield className="size-12 text-red-500 animate-pulse" />
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">ACCESS DENIED</h1>
            <p className="text-sm text-zinc-500 font-mono max-w-md">
              Authorized operator session is required. Your security signature lacks administrative authorization claims.
            </p>
            <a
              href="/admin/login"
              className="mt-2 text-xs font-mono border border-zinc-800 bg-zinc-900 px-4 py-2 text-zinc-300 hover:text-white rounded transition-colors"
            >
              Return to Login Terminal
            </a>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
