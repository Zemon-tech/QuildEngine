import { z } from "zod";

export type Role =
  | "super_admin"
  | "admin"
  | "moderator"
  | "mentor"
  | "instructor"
  | "researcher"
  | "content_manager"
  | "student"
  | "professional"
  | "guest";

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
  super_admin: "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
  mentor: "Mentor",
  instructor: "Instructor",
  researcher: "Researcher",
  content_manager: "Content Manager",
  student: "Student",
  professional: "Professional",
  guest: "Guest",
};

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
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
  mentor: [
    "research.read",
    "course.read",
    "course.write",
    "roadmap.read",
    "roadmap.edit",
  ],
  instructor: [
    "research.read",
    "course.read",
    "course.write",
    "course.publish",
    "roadmap.read",
  ],
  researcher: ["research.read", "research.write", "research.publish"],
  content_manager: [
    "course.read",
    "course.write",
    "course.publish",
    "roadmap.read",
    "roadmap.edit",
    "newsletter.manage",
  ],
  student: ["course.read", "roadmap.read"],
  professional: ["course.read", "roadmap.read", "research.read"],
  guest: ["course.read"],
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
  if (!role) return "guest";
  const normalized = role.toLowerCase().replace(" ", "_") as Role;
  return normalized in ROLE_PERMISSIONS ? normalized : "guest";
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
