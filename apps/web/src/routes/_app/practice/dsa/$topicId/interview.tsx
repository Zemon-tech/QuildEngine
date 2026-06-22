import { createFileRoute } from "@tanstack/react-router";
import { TopicInterviewMode } from "#/components/dsa/topic-interview-mode";
import { useDSACategory } from "#/hooks/use-practice";

export const Route = createFileRoute("/_app/practice/dsa/$topicId/interview")({
  component: InterviewTab,
});

/**
 * Interview Arena tab — /practice/dsa/$topicId/interview
 */
function InterviewTab() {
  const { topicId } = Route.useParams();
  const { data: category } = useDSACategory(topicId);
  return <TopicInterviewMode topicName={category?.name ?? topicId} />;
}
