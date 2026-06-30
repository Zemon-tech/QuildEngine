export type NodeDifficulty = "beginner" | "intermediate" | "advanced";

export type NodeStatus = "not_started" | "in_progress" | "completed" | "locked";

export type ResourceType =
  | "article"
  | "documentation"
  | "video"
  | "practice"
  | "github"
  | "notes";

export interface Resource {
  title: string;
  source: string;
  duration: string;
  difficulty: NodeDifficulty;
  type: ResourceType;
  url: string;
}

export interface RoadmapNodeData {
  title: string;
  description: string;
  duration: string;
  difficulty: NodeDifficulty;
  resourceCount: number;
  resources: Resource[];
  status: NodeStatus;
}

// Custom node structure for React Flow custom nodes
export interface RoadmapNode {
  id: string;
  type: "roadmapNode"; // Matches custom React Flow node component name
  position: { x: number; y: number };
  data: RoadmapNodeData;
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: NodeDifficulty;
  duration: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export interface RoadmapCategory {
  id: string;
  title: string;
  description: string;
  iconName: string; // Dynamic icon name (mapped to Lucide icon)
  topicsCount: number;
  difficulty: NodeDifficulty;
  duration: string;
  progress: number;
}

export interface UserProgress {
  completedNodes: string[];
  bookmarkedNodes: string[];
  favorites: string[];
  xpPoints: number;
  learningStreak: number;
  lastVisitedNode: string | null;
  activeRoadmaps: Record<string, number>; // Mapping from roadmapId to progress percentage
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  status: "locked" | "unlocked";
  iconName: string;
  unlockedAt?: string;
  xpValue: number;
}
