import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/courses/$courseId/articles")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/courses/$courseId",
      params: { courseId: params.courseId },
    });
  },
  component: () => null,
});
