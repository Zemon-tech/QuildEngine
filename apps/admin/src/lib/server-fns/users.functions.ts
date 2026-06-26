/**
 * User management server functions.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminMiddleware } from "../middleware";
import { backendFetch } from "../api.server";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastActive?: string;
  avatar?: string;
}

export interface InviteLink {
  id: string;
  email: string;
  token: string;
  used: boolean;
  createdBy: string;
  expiresAt: string;
  createdAt: string;
}

export const fetchUsers = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    return backendFetch<AdminUser[]>("/api/v1/admin/users");
  });

export const fetchUser = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return backendFetch<AdminUser>(`/api/v1/admin/users/${data.userId}`);
  });

export const updateUserRole = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(
    z.object({
      userId: z.string(),
      role: z.enum(["superadmin", "admin", "editor", "moderator", "user"]),
    }),
  )
  .handler(async ({ data }) => {
    return backendFetch<AdminUser>(`/api/v1/admin/users/${data.userId}/role`, {
      method: "PATCH",
      body: { role: data.role },
    });
  });

export const suspendUser = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return backendFetch<AdminUser>(`/api/v1/admin/users/${data.userId}/suspend`, {
      method: "POST",
    });
  });

export const createInvite = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    return backendFetch<InviteLink>("/api/v1/admin/invites", {
      method: "POST",
      body: { email: data.email },
    });
  });

export const fetchInvites = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    return backendFetch<InviteLink[]>("/api/v1/admin/invites");
  });
