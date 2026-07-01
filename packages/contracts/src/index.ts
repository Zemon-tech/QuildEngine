import { z } from "zod";

export type Role =
  | "admin"
  | "moderator"
  | "user";

export type Permission =
  | "research.read"
  | "research.write"
  | "research.publish"
  | "course.read"
  | "course.write"
  | "course.publish"
  | "roadmap.read"
  | "roadmap.edit"
  | "practice.manage"
  | "events.manage"
  | "newsletter.manage"
  | "users.manage"
  | "admins.manage"
  | "analytics.view"
  | "settings.manage";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  moderator: "Moderator",
  user: "User",
};

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "research.read",
    "research.write",
    "research.publish",
    "course.read",
    "course.write",
    "course.publish",
    "roadmap.read",
    "roadmap.edit",
    "practice.manage",
    "events.manage",
    "newsletter.manage",
    "users.manage",
    "admins.manage",
    "analytics.view",
    "settings.manage",
  ],
  moderator: [
    "research.read",
    "course.read",
    "roadmap.read",
    "practice.manage",
    "events.manage",
    "newsletter.manage",
  ],
  user: [
    "course.read",
    "roadmap.read",
    "research.read",
  ],
};

/**
 * Checks if a given role has a specific permission.
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const normalizedRole = role.toLowerCase().replace(" ", "_") as Role;
  const permissions = ROLE_PERMISSIONS[normalizedRole];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Validates role input and returns fallback if invalid.
 */
export function normalizeRole(role: string | null | undefined): Role {
  if (!role) return "user";
  const normalized = role.toLowerCase().replace(" ", "_") as Role;
  return normalized in ROLE_PERMISSIONS ? normalized : "user";
}

// Zod Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Zod Signup Schema
export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupInput = z.infer<typeof signupSchema>;

// Auth Types
export interface User {
  id: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

export interface Session {
  accessToken: string;
  refreshToken?: string;
  user: User;
}
