import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { WorkspaceLayout } from "#/components/workspace/workspace-layout";
import { useWorkspaceStore } from "#/store/use-workspace-store";
import { z } from "zod";

const problemSearchSchema = z.object({
  tab: z.enum(["description", "editorial", "ai", "discussion", "submissions", "review", "notes"]).optional().catch("description"),
});

export const Route = createFileRoute("/_app/practice/problem/$problemId")({
  validateSearch: (search) => problemSearchSchema.parse(search),
  component: ProblemWorkspacePage,
});

function ProblemWorkspacePage() {
  const { problemId } = Route.useParams();
  
  const setLastOpenedProblem = useWorkspaceStore(
    (state) => state.setLastOpenedProblem,
  );

  useEffect(() => {
    setLastOpenedProblem(problemId);
  }, [problemId, setLastOpenedProblem]);

  return <WorkspaceLayout problemId={problemId} />;
}
