/**
 * Courses (LMS) server functions.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { backendFetch } from "../api.server";
import { adminMiddleware } from "../middleware";

export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  status: "draft" | "published";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  moduleCount: number;
  lessonCount: number;
  enrolledCount: number;
}

export interface AdminModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessonCount: number;
}

export interface AdminLesson {
  id: string;
  moduleId: string;
  title: string;
  type: "content" | "problem" | "quiz";
  order: number;
  status: "draft" | "published";
}

export const fetchCourses = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    return backendFetch<AdminCourse[]>("/api/v1/admin/courses");
  });

export const fetchCourse = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .validator(z.object({ courseId: z.string() }))
  .handler(async ({ data }) => {
    return backendFetch<AdminCourse>(`/api/v1/admin/courses/${data.courseId}`);
  });

export const createCourse = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(
    z.object({
      title: z.string().min(1),
      description: z.string(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]),
      tags: z.array(z.string()),
    }),
  )
  .handler(async ({ data }) => {
    return backendFetch<AdminCourse>("/api/v1/admin/courses", {
      method: "POST",
      body: data,
    });
  });

export const updateCourse = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(
    z.object({
      courseId: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      status: z.enum(["draft", "published"]).optional(),
      tags: z.array(z.string()).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { courseId, ...body } = data;
    return backendFetch<AdminCourse>(`/api/v1/admin/courses/${courseId}`, {
      method: "PATCH",
      body,
    });
  });

export const deleteCourse = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ courseId: z.string() }))
  .handler(async ({ data }) => {
    return backendFetch(`/api/v1/admin/courses/${data.courseId}`, {
      method: "DELETE",
    });
  });

export const fetchCourseModules = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .validator(z.object({ courseId: z.string() }))
  .handler(async ({ data }) => {
    return backendFetch<AdminModule[]>(
      `/api/v1/admin/courses/${data.courseId}/modules`,
    );
  });

export const fetchModuleLessons = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .validator(z.object({ moduleId: z.string() }))
  .handler(async ({ data }) => {
    return backendFetch<AdminLesson[]>(
      `/api/v1/admin/modules/${data.moduleId}/lessons`,
    );
  });
