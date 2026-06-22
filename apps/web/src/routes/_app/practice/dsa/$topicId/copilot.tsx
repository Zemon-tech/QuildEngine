import { createFileRoute } from "@tanstack/react-router";
import { TopicAIAssistant } from "#/components/dsa/topic-ai-assistant";
import { useDSACategory } from "#/hooks/use-practice";

export const Route = createFileRoute("/_app/practice/dsa/$topicId/copilot")({
  component: CopilotTab,
});

/**
 * AI Study Copilot tab — /practice/dsa/$topicId/copilot
 */
function CopilotTab() {
  const { topicId } = Route.useParams();
  const { data: category } = useDSACategory(topicId);
  return <TopicAIAssistant topicName={category?.name ?? topicId} />;
}
