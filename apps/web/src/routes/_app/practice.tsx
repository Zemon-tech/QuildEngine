import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/practice")({
  component: PracticeLayout,
});

/**
 * Practice module layout route.
 * All /practice/* routes render inside this layout.
 * Keeps the layout shell and secondary sidebar persistent
 * while navigating between DSA, Interview Q&A, Case Studies, and Assessments.
 */
function PracticeLayout() {
  return <Outlet />;
}
