import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TopicRoadmap } from "#/components/dsa/topic-roadmap";
import { type DSAProblem, dsaProblems } from "#/lib/dsa-problems-db";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/practice/dsa/$topicId/roadmap")({
  component: RoadmapTab,
});

/**
 * Learning Roadmap tab — /practice/dsa/$topicId/roadmap
 */
function RoadmapTab() {
  const { topicId } = Route.useParams();
  const navigate = useNavigate();
  const [localProblems, setLocalProblems] = useState<DSAProblem[]>([]);

  useEffect(() => {
    setLocalProblems(dsaProblems[topicId] || []);
  }, [topicId]);

  const handleSelectSubtopic = (_sub: string) => {
    // Navigate back to practice board when a subtopic is selected from roadmap
    navigate({
      to: "/practice/dsa/$topicId" as any,
      params: { topicId } as any,
    });
  };

  return (
    <TopicRoadmap
      topicId={topicId}
      problems={localProblems}
      onSelectSubtopic={handleSelectSubtopic}
    />
  );
}
