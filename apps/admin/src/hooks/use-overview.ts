import { useQuery } from "@tanstack/react-query";

// ==========================================
// Interfaces & Types
// ==========================================

export interface MetricValue {
  value: number | string;
  changePercent: number;
  direction: "up" | "down" | "neutral";
  comparisonText: string;
  description: string;
}

export interface PlatformMetrics {
  totalUsers: MetricValue;
  activeUsers: MetricValue;
  coursesPublished: MetricValue;
  roadmapsPublished: MetricValue;
  researchArticles: MetricValue;
  dsaProblems: MetricValue;
  eventRegistrations: MetricValue;
  newsletterSubscribers: MetricValue;
  aiUsageStats: MetricValue;
  revenueMetrics: MetricValue;
}

export interface UserAnalytics {
  newUsersCount: number;
  activeUsersCount: number;
  growthRatePercent: number;
  retentionRatePercent: number;
  growthHistory: { date: string; users: number }[];
}

export interface CourseItem {
  id: string;
  title: string;
  enrolled: number;
  completionRate: number;
}

export interface LearningAnalytics {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  completionRatePercent: number;
  mostPopularCourses: CourseItem[];
  courseGrowthHistory: { date: string; courses: number }[];
}

export interface PracticeAnalytics {
  totalProblems: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  dailyProblemSolves: { date: string; solves: number }[];
  contestParticipationCount: number;
}

export interface ResearchDocument {
  id: string;
  title: string;
  updatedAt: string;
  status: "published" | "draft";
}

export interface ResearchAnalytics {
  publishedCount: number;
  draftCount: number;
  activeRoadmapsCount: number;
  recentlyUpdated: ResearchDocument[];
  researchActivityHistory: { date: string; articles: number }[];
}

export interface AIAnalytics {
  aiRequestsCount: number;
  tokenUsageCount: number;
  activeAiUsersCount: number;
  promptUsageCount: number;
  apiCallsCount: number;
  modelUsageDistribution: { name: string; requests: number }[];
  aiRequestsHistory: { date: string; requests: number }[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  registrationsCount: number;
  status: "upcoming" | "active" | "completed";
}

export interface EventAnalytics {
  upcomingEventsCount: number;
  totalRegistrationsCount: number;
  activeEventsCount: number;
  completedEventsCount: number;
  upcomingEventsList: EventItem[];
  eventRegistrationsHistory: { date: string; registrations: number }[];
}

export interface RecentActivityItem {
  id: string;
  type:
    | "user_signup"
    | "course_published"
    | "research_created"
    | "problem_created"
    | "event_created"
    | "ai_request";
  description: string;
  timestamp: string;
  actor: string;
}

// ==========================================
// Mock Data Generators
// ==========================================

const mockPlatformMetrics: PlatformMetrics = {
  totalUsers: {
    value: 12480,
    changePercent: 12.4,
    direction: "up",
    comparisonText: "vs last month",
    description: "Total registered accounts",
  },
  activeUsers: {
    value: 3842,
    changePercent: 8.2,
    direction: "up",
    comparisonText: "vs last week",
    description: "Users active in last 7 days",
  },
  coursesPublished: {
    value: 48,
    changePercent: 4.3,
    direction: "up",
    comparisonText: "vs last month",
    description: "Fully accessible courses",
  },
  roadmapsPublished: {
    value: 24,
    changePercent: 0,
    direction: "neutral",
    comparisonText: "no change",
    description: "Interactive skill paths",
  },
  researchArticles: {
    value: 89,
    changePercent: 15.6,
    direction: "up",
    comparisonText: "vs last month",
    description: "DeepTech research articles",
  },
  dsaProblems: {
    value: 642,
    changePercent: 5.1,
    direction: "up",
    comparisonText: "vs last month",
    description: "Coding challenges",
  },
  eventRegistrations: {
    value: 1894,
    changePercent: 24.8,
    direction: "up",
    comparisonText: "vs last month",
    description: "Event signups",
  },
  newsletterSubscribers: {
    value: 9281,
    changePercent: 6.7,
    direction: "up",
    comparisonText: "vs last week",
    description: "Newsletter list size",
  },
  aiUsageStats: {
    value: 84920,
    changePercent: 41.2,
    direction: "up",
    comparisonText: "vs last week",
    description: "AI queries run this week",
  },
  revenueMetrics: {
    value: "$14,820",
    changePercent: 18.3,
    direction: "up",
    comparisonText: "vs last month",
    description: "Platform GMV (Projected)",
  },
};

const mockUserAnalytics: UserAnalytics = {
  newUsersCount: 1420,
  activeUsersCount: 3842,
  growthRatePercent: 12.4,
  retentionRatePercent: 78.4,
  growthHistory: [
    { date: "Jun 20", users: 11200 },
    { date: "Jun 21", users: 11400 },
    { date: "Jun 22", users: 11650 },
    { date: "Jun 23", users: 11900 },
    { date: "Jun 24", users: 12150 },
    { date: "Jun 25", users: 12300 },
    { date: "Jun 26", users: 12480 },
  ],
};

const mockLearningAnalytics: LearningAnalytics = {
  totalCourses: 54,
  publishedCourses: 48,
  draftCourses: 6,
  completionRatePercent: 42.8,
  mostPopularCourses: [
    {
      id: "c1",
      title: "Advanced Data Structures & Algorithms",
      enrolled: 1280,
      completionRate: 38,
    },
    {
      id: "c2",
      title: "Full-Stack Web Dev with TanStack",
      enrolled: 980,
      completionRate: 52,
    },
    {
      id: "c3",
      title: "Machine Learning Foundations",
      enrolled: 840,
      completionRate: 31,
    },
    {
      id: "c4",
      title: "Introduction to System Design",
      enrolled: 720,
      completionRate: 45,
    },
  ],
  courseGrowthHistory: [
    { date: "Jun 20", courses: 42 },
    { date: "Jun 21", courses: 43 },
    { date: "Jun 22", courses: 44 },
    { date: "Jun 23", courses: 44 },
    { date: "Jun 24", courses: 46 },
    { date: "Jun 25", courses: 47 },
    { date: "Jun 26", courses: 48 },
  ],
};

const mockPracticeAnalytics: PracticeAnalytics = {
  totalProblems: 642,
  difficultyDistribution: { easy: 240, medium: 282, hard: 120 },
  dailyProblemSolves: [
    { date: "Jun 20", solves: 420 },
    { date: "Jun 21", solves: 480 },
    { date: "Jun 22", solves: 510 },
    { date: "Jun 23", solves: 390 },
    { date: "Jun 24", solves: 460 },
    { date: "Jun 25", solves: 580 },
    { date: "Jun 26", solves: 620 },
  ],
  contestParticipationCount: 890,
};

const mockResearchAnalytics: ResearchAnalytics = {
  publishedCount: 89,
  draftCount: 14,
  activeRoadmapsCount: 24,
  recentlyUpdated: [
    {
      id: "r1",
      title: "Decentralized Consensus at Scale",
      updatedAt: "10m ago",
      status: "published",
    },
    {
      id: "r2",
      title: "LLM Post-training Optimizations",
      updatedAt: "1h ago",
      status: "published",
    },
    {
      id: "r3",
      title: "Quantum Compilation Pipeline Design",
      updatedAt: "4h ago",
      status: "draft",
    },
    {
      id: "r4",
      title: "Privacy-Preserving Computation Review",
      updatedAt: "1d ago",
      status: "published",
    },
  ],
  researchActivityHistory: [
    { date: "Jun 20", articles: 80 },
    { date: "Jun 21", articles: 81 },
    { date: "Jun 22", articles: 83 },
    { date: "Jun 23", articles: 84 },
    { date: "Jun 24", articles: 86 },
    { date: "Jun 25", articles: 87 },
    { date: "Jun 26", articles: 89 },
  ],
};

const mockAiAnalytics: AIAnalytics = {
  aiRequestsCount: 84920,
  tokenUsageCount: 42890400,
  activeAiUsersCount: 1420,
  promptUsageCount: 3840,
  apiCallsCount: 92450,
  modelUsageDistribution: [
    { name: "Gemini 1.5 Pro", requests: 48900 },
    { name: "Gemini 1.5 Flash", requests: 26020 },
    { name: "Claude 3.5 Sonnet", requests: 10000 },
  ],
  aiRequestsHistory: [
    { date: "Jun 20", requests: 9800 },
    { date: "Jun 21", requests: 10400 },
    { date: "Jun 22", requests: 11200 },
    { date: "Jun 23", requests: 12900 },
    { date: "Jun 24", requests: 13500 },
    { date: "Jun 25", requests: 14120 },
    { date: "Jun 26", requests: 15400 },
  ],
};

const mockEventAnalytics: EventAnalytics = {
  upcomingEventsCount: 5,
  totalRegistrationsCount: 1894,
  activeEventsCount: 1,
  completedEventsCount: 18,
  upcomingEventsList: [
    {
      id: "e1",
      title: "Live System Design Mock Interview",
      date: "Jun 28, 18:00",
      registrationsCount: 245,
      status: "upcoming",
    },
    {
      id: "e2",
      title: "Deep Dive into TanStack Start SSR",
      date: "Jun 30, 19:30",
      registrationsCount: 184,
      status: "upcoming",
    },
    {
      id: "e3",
      title: "AI Agent Framework Hackathon Kickoff",
      date: "Jul 05, 10:00",
      registrationsCount: 412,
      status: "upcoming",
    },
  ],
  eventRegistrationsHistory: [
    { date: "Jun 20", registrations: 1620 },
    { date: "Jun 21", registrations: 1670 },
    { date: "Jun 22", registrations: 1710 },
    { date: "Jun 23", registrations: 1740 },
    { date: "Jun 24", registrations: 1800 },
    { date: "Jun 25", registrations: 1845 },
    { date: "Jun 26", registrations: 1894 },
  ],
};

const mockRecentActivities: RecentActivityItem[] = [
  {
    id: "act1",
    type: "user_signup",
    description: "New user registered: sarah.k@quild.io",
    timestamp: "3m ago",
    actor: "sarah.k",
  },
  {
    id: "act2",
    type: "course_published",
    description: "Course 'Advanced DSA and Red-Black Trees' published",
    timestamp: "14m ago",
    actor: "Alex Chen (Instructor)",
  },
  {
    id: "act3",
    type: "ai_request",
    description:
      "AI query executed: 'Explain topological sort using Tarjan's algorithm'",
    timestamp: "25m ago",
    actor: "User #9482",
  },
  {
    id: "act4",
    type: "research_created",
    description:
      "Research Paper draft created: 'Evaluating Transformer Scaling Laws'",
    timestamp: "1h ago",
    actor: "Dr. Elena Rostova",
  },
  {
    id: "act5",
    type: "problem_created",
    description: "DSA Practice problem 'Median of Two Sorted Arrays' created",
    timestamp: "2h ago",
    actor: "Admin Team",
  },
  {
    id: "act6",
    type: "event_created",
    description: "Community Event 'TanStack Start Deep Dive' scheduled",
    timestamp: "3h ago",
    actor: "Marcus Vance",
  },
  {
    id: "act7",
    type: "ai_request",
    description: "AI workspace environment setup initiated",
    timestamp: "4h ago",
    actor: "User #1184",
  },
];

// Helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// React Query Hooks
// ==========================================

export function usePlatformMetrics() {
  return useQuery({
    queryKey: ["admin", "overview", "metrics"],
    queryFn: async () => {
      await delay(750); // Simulate network roundtrip
      return mockPlatformMetrics;
    },
    staleTime: 30_000, // Cache for 30s
  });
}

export function useUserAnalytics() {
  return useQuery({
    queryKey: ["admin", "overview", "users"],
    queryFn: async () => {
      await delay(900);
      return mockUserAnalytics;
    },
    staleTime: 45_000,
  });
}

export function useLearningAnalytics() {
  return useQuery({
    queryKey: ["admin", "overview", "learning"],
    queryFn: async () => {
      await delay(800);
      return mockLearningAnalytics;
    },
    staleTime: 60_000,
  });
}

export function usePracticeAnalytics() {
  return useQuery({
    queryKey: ["admin", "overview", "practice"],
    queryFn: async () => {
      await delay(850);
      return mockPracticeAnalytics;
    },
    staleTime: 60_000,
  });
}

export function useResearchAnalytics() {
  return useQuery({
    queryKey: ["admin", "overview", "research"],
    queryFn: async () => {
      await delay(700);
      return mockResearchAnalytics;
    },
    staleTime: 60_000,
  });
}

export function useAiAnalytics() {
  return useQuery({
    queryKey: ["admin", "overview", "ai"],
    queryFn: async () => {
      await delay(1000);
      return mockAiAnalytics;
    },
    staleTime: 15_000, // Highly dynamic, cache only for 15s
  });
}

export function useEventAnalytics() {
  return useQuery({
    queryKey: ["admin", "overview", "events"],
    queryFn: async () => {
      await delay(950);
      return mockEventAnalytics;
    },
    staleTime: 120_000,
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ["admin", "overview", "activities"],
    queryFn: async () => {
      await delay(600);
      return mockRecentActivities;
    },
    staleTime: 10_000, // Short cache for activities
  });
}
