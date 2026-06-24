import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../middleware";
import type { Roadmap, RoadmapCategory, UserProgress, Achievement, NodeDifficulty } from "../../types/roadmaps";

// ─── Mock Category Data ────────────────────────────────────────────────────────
export const MOCK_CATEGORIES: RoadmapCategory[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "Step-by-step guide to becoming a modern frontend developer focusing on React and responsive design.",
    iconName: "Monitor",
    topicsCount: 6,
    difficulty: "beginner",
    duration: "2-3 months",
    progress: 0,
  },
  {
    id: "backend",
    title: "Backend Developer",
    description: "Detailed path for building scalable backend systems, focusing on APIs, caching, and distributed databases.",
    iconName: "Server",
    topicsCount: 5,
    difficulty: "intermediate",
    duration: "3-4 months",
    progress: 0,
  },
  {
    id: "ai-ml",
    title: "AI / ML Engineer",
    description: "Practical guide to learning machine learning pipelines, deep learning models, and LLM fine-tuning.",
    iconName: "Brain",
    topicsCount: 5,
    difficulty: "advanced",
    duration: "4-6 months",
    progress: 0,
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    description: "Master both ends of the stack, bridging client interfaces with underlying databases and server architecture.",
    iconName: "Layers",
    topicsCount: 4,
    difficulty: "intermediate",
    duration: "4-5 months",
    progress: 0,
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    description: "Focus on build pipelines, deployment systems, Kubernetes orchestration, and cloud infrastructure.",
    iconName: "Infinity",
    topicsCount: 4,
    difficulty: "advanced",
    duration: "3-4 months",
    progress: 0,
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Learn statistical modeling, data visualization, Pandas analysis, and data engineering patterns.",
    iconName: "Database",
    topicsCount: 4,
    difficulty: "intermediate",
    duration: "2-3 months",
    progress: 0,
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    description: "Understand penetration testing, network defense, system audits, and secure coding practices.",
    iconName: "Shield",
    topicsCount: 4,
    difficulty: "advanced",
    duration: "4-5 months",
    progress: 0,
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description: "Build native and cross-platform apps using React Native, Flutter, Swift, and Kotlin.",
    iconName: "Smartphone",
    topicsCount: 4,
    difficulty: "intermediate",
    duration: "2-3 months",
    progress: 0,
  },
  {
    id: "cloud",
    title: "Cloud Computing",
    description: "Master Amazon Web Services (AWS), Google Cloud (GCP), serverless patterns, and hybrid cloud designs.",
    iconName: "Cloud",
    topicsCount: 4,
    difficulty: "intermediate",
    duration: "2-3 months",
    progress: 0,
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Architect large-scale software structures. Learn load balancers, messaging queues, and scaling strategies.",
    iconName: "GitFork",
    topicsCount: 4,
    difficulty: "advanced",
    duration: "1-2 months",
    progress: 0,
  },
  {
    id: "ui-ux",
    title: "UI / UX Designer",
    description: "Dive into wireframing, color theory, component design systems, usability research, and Figma handoffs.",
    iconName: "Palette",
    topicsCount: 4,
    difficulty: "beginner",
    duration: "2 months",
    progress: 0,
  },
  {
    id: "competitive-programming",
    title: "Competitive Programming",
    description: "Master algorithms, graphs, dynamic programming, and complexity logic for speed coding tests.",
    iconName: "Code2",
    topicsCount: 4,
    difficulty: "advanced",
    duration: "3 months",
    progress: 0,
  },
];

// ─── Helper Mock Nodes & Edges ──────────────────────────────────────────────────
const createMockResources = (topic: string, diff: NodeDifficulty) => [
  {
    title: `Official Guide: Getting Started with ${topic}`,
    source: "Documentation",
    duration: "15 min read",
    difficulty: diff,
    type: "documentation" as const,
    url: "https://example.com/docs",
  },
  {
    title: `Mastering ${topic} - Interactive Walkthrough`,
    source: "Web Dev Blog",
    duration: "10 min read",
    difficulty: diff,
    type: "article" as const,
    url: "https://example.com/blog",
  },
  {
    title: `${topic} Course for Beginners`,
    source: "CodeTube",
    duration: "2 hour video course",
    difficulty: diff,
    type: "video" as const,
    url: "https://example.com/video",
  },
  {
    title: `Practice Lab: ${topic} Challenges`,
    source: "Quild Practice",
    duration: "30 min quiz",
    difficulty: diff,
    type: "practice" as const,
    url: "https://example.com/practice",
  },
  {
    title: `Awesome ${topic} Repository`,
    source: "GitHub",
    duration: "Resource Index",
    difficulty: diff,
    type: "github" as const,
    url: "https://example.com/github",
  },
];

// ─── Detailed Roadmaps Data ─────────────────────────────────────────────────────
export const MOCK_ROADMAPS: Record<string, Roadmap> = {
  frontend: {
    id: "frontend",
    title: "Frontend Developer",
    description: "A comprehensive roadmap for mastering modern client-side architectures.",
    category: "Frontend",
    difficulty: "beginner",
    duration: "2-3 months",
    nodes: [
      {
        id: "fe-html-css",
        type: "roadmapNode",
        position: { x: 300, y: 50 },
        data: {
          title: "HTML & CSS Basics",
          description: "Structure web pages and style them with modern CSS layouts (Flexbox, Grid).",
          duration: "1 week",
          difficulty: "beginner",
          resourceCount: 5,
          resources: createMockResources("HTML & CSS", "beginner"),
          status: "not_started",
        },
      },
      {
        id: "fe-javascript",
        type: "roadmapNode",
        position: { x: 300, y: 200 },
        data: {
          title: "JavaScript ES6+",
          description: "Learn variables, loops, DOM manipulations, async programming, and modern APIs.",
          duration: "2 weeks",
          difficulty: "beginner",
          resourceCount: 5,
          resources: createMockResources("JavaScript ES6+", "beginner"),
          status: "not_started",
        },
      },
      {
        id: "fe-react",
        type: "roadmapNode",
        position: { x: 150, y: 380 },
        data: {
          title: "React Fundamentals",
          description: "Understand state, props, JSX, component lifecycle, hooks, and basic routing.",
          duration: "3 weeks",
          difficulty: "intermediate",
          resourceCount: 5,
          resources: createMockResources("React Basics", "intermediate"),
          status: "not_started",
        },
      },
      {
        id: "fe-tailwind",
        type: "roadmapNode",
        position: { x: 450, y: 380 },
        data: {
          title: "Tailwind CSS",
          description: "Speed up styling with utility-first designs, responsive tags, and theme transitions.",
          duration: "1 week",
          difficulty: "intermediate",
          resourceCount: 5,
          resources: createMockResources("Tailwind CSS", "intermediate"),
          status: "not_started",
        },
      },
      {
        id: "fe-nextjs",
        type: "roadmapNode",
        position: { x: 300, y: 560 },
        data: {
          title: "Next.js & SSR/SSG",
          description: "Master React framework features: dynamic routing, Server Components, API routes, and SSR fetching.",
          duration: "3 weeks",
          difficulty: "intermediate",
          resourceCount: 5,
          resources: createMockResources("Next.js App Router", "intermediate"),
          status: "not_started",
        },
      },
      {
        id: "fe-performance",
        type: "roadmapNode",
        position: { x: 300, y: 720 },
        data: {
          title: "Web Performance Tuning",
          description: "Optimizing bundle size, image loaders, code splitting, cumulative layout shifts, and core web vitals.",
          duration: "2 weeks",
          difficulty: "advanced",
          resourceCount: 5,
          resources: createMockResources("Web Performance", "advanced"),
          status: "not_started",
        },
      },
    ],
    edges: [
      { id: "e-fe-1", source: "fe-html-css", target: "fe-javascript" },
      { id: "e-fe-2", source: "fe-javascript", target: "fe-react" },
      { id: "e-fe-3", source: "fe-javascript", target: "fe-tailwind" },
      { id: "e-fe-4", source: "fe-react", target: "fe-nextjs" },
      { id: "e-fe-5", source: "fe-tailwind", target: "fe-nextjs" },
      { id: "e-fe-6", source: "fe-nextjs", target: "fe-performance", animated: true },
    ],
  },
  backend: {
    id: "backend",
    title: "Backend Developer",
    description: "Pathway to database query design, API specifications, and service infrastructures.",
    category: "Backend",
    difficulty: "intermediate",
    duration: "3-4 months",
    nodes: [
      {
        id: "be-lang",
        type: "roadmapNode",
        position: { x: 300, y: 50 },
        data: {
          title: "Language Basics (Go/Node/Python)",
          description: "Learn server languages, modules, concurrency models, and standard web servers.",
          duration: "2 weeks",
          difficulty: "beginner",
          resourceCount: 5,
          resources: createMockResources("Backend Languages", "beginner"),
          status: "not_started",
        },
      },
      {
        id: "be-db",
        type: "roadmapNode",
        position: { x: 300, y: 200 },
        data: {
          title: "Databases & Indexing",
          description: "Master SQL (PostgreSQL), normalization, indices, transactions, and basic NoSQL (MongoDB).",
          duration: "3 weeks",
          difficulty: "intermediate",
          resourceCount: 5,
          resources: createMockResources("Databases", "intermediate"),
          status: "not_started",
        },
      },
      {
        id: "be-cache",
        type: "roadmapNode",
        position: { x: 300, y: 350 },
        data: {
          title: "Caching Layers (Redis)",
          description: "Accelerate responses via caching, pub/sub communication, rate-limiting, and memory data structures.",
          duration: "2 weeks",
          difficulty: "intermediate",
          resourceCount: 5,
          resources: createMockResources("Caching & Redis", "intermediate"),
          status: "not_started",
        },
      },
      {
        id: "be-microservices",
        type: "roadmapNode",
        position: { x: 150, y: 520 },
        data: {
          title: "Microservices & gRPC",
          description: "Architect service-oriented patterns, protocol buffers, message formats, and inter-service APIs.",
          duration: "3 weeks",
          difficulty: "advanced",
          resourceCount: 5,
          resources: createMockResources("Microservices & gRPC", "advanced"),
          status: "not_started",
        },
      },
      {
        id: "be-distributed",
        type: "roadmapNode",
        position: { x: 450, y: 520 },
        data: {
          title: "Distributed Consensus",
          description: "Understand Paxos, Raft, event-sourcing, eventual consistency, and network partitions (CAP theorem).",
          duration: "4 weeks",
          difficulty: "advanced",
          resourceCount: 5,
          resources: createMockResources("Distributed Systems", "advanced"),
          status: "not_started",
        },
      },
    ],
    edges: [
      { id: "e-be-1", source: "be-lang", target: "be-db" },
      { id: "e-be-2", source: "be-db", target: "be-cache" },
      { id: "e-be-3", source: "be-cache", target: "be-microservices" },
      { id: "e-be-4", source: "be-cache", target: "be-distributed" },
    ],
  },
  "ai-ml": {
    id: "ai-ml",
    title: "AI / ML Engineer",
    description: "Deep dive into model architectures, pipelines, and intelligent interfaces.",
    category: "AI / ML",
    difficulty: "advanced",
    duration: "4-6 months",
    nodes: [
      {
        id: "ai-python-math",
        type: "roadmapNode",
        position: { x: 300, y: 50 },
        data: {
          title: "Python & Linear Algebra",
          description: "Acquire basic mathematical building blocks: vectors, matrices, statistics, and NumPy library.",
          duration: "2 weeks",
          difficulty: "beginner",
          resourceCount: 5,
          resources: createMockResources("Math & Python", "beginner"),
          status: "not_started",
        },
      },
      {
        id: "ai-scikit",
        type: "roadmapNode",
        position: { x: 300, y: 200 },
        data: {
          title: "Scikit-Learn & ML Classifiers",
          description: "Learn regression, decision trees, support vector machines, and metric validations.",
          duration: "3 weeks",
          difficulty: "intermediate",
          resourceCount: 5,
          resources: createMockResources("Machine Learning", "intermediate"),
          status: "not_started",
        },
      },
      {
        id: "ai-pytorch",
        type: "roadmapNode",
        position: { x: 300, y: 350 },
        data: {
          title: "PyTorch & Deep Neural Nets",
          description: "Construct custom neural networks, gradients, forward/backward propagation, and GPU optimizations.",
          duration: "4 weeks",
          difficulty: "intermediate",
          resourceCount: 5,
          resources: createMockResources("PyTorch", "intermediate"),
          status: "not_started",
        },
      },
      {
        id: "ai-transformers",
        type: "roadmapNode",
        position: { x: 150, y: 520 },
        data: {
          title: "Transformers & Attention",
          description: "Examine self-attention modules, seq2seq models, encoders, and decoders (GPT, BERT architectures).",
          duration: "3 weeks",
          difficulty: "advanced",
          resourceCount: 5,
          resources: createMockResources("Transformers", "advanced"),
          status: "not_started",
        },
      },
      {
        id: "ai-finetune",
        type: "roadmapNode",
        position: { x: 450, y: 520 },
        data: {
          title: "LLM Fine-Tuning & RAG",
          description: "Fine-tune pretrained weights with LoRA, QLoRA, and build Vector DB indexing (Retrieval Augmented Generation).",
          duration: "3 weeks",
          difficulty: "advanced",
          resourceCount: 5,
          resources: createMockResources("LLM Fine-Tuning", "advanced"),
          status: "not_started",
        },
      },
    ],
    edges: [
      { id: "e-ai-1", source: "ai-python-math", target: "ai-scikit" },
      { id: "e-ai-2", source: "ai-scikit", target: "ai-pytorch" },
      { id: "e-ai-3", source: "ai-pytorch", target: "ai-transformers" },
      { id: "e-ai-4", source: "ai-pytorch", target: "ai-finetune" },
    ],
  },
};

// Generate fallback roadmaps for remaining 9 categories so they load beautifully.
const populateFallbackRoadmaps = () => {
  MOCK_CATEGORIES.forEach((cat) => {
    if (!MOCK_ROADMAPS[cat.id]) {
      MOCK_ROADMAPS[cat.id] = {
        id: cat.id,
        title: cat.title,
        description: cat.description,
        category: cat.title,
        difficulty: cat.difficulty,
        duration: cat.duration,
        nodes: [
          {
            id: `${cat.id}-node-1`,
            type: "roadmapNode",
            position: { x: 300, y: 50 },
            data: {
              title: `Introduction to ${cat.title}`,
              description: `Kickstart your pathway into ${cat.title}. Essential building blocks and fundamental concepts.`,
              duration: "2 weeks",
              difficulty: "beginner",
              resourceCount: 5,
              resources: createMockResources(`Intro to ${cat.title}`, "beginner"),
              status: "not_started",
            },
          },
          {
            id: `${cat.id}-node-2`,
            type: "roadmapNode",
            position: { x: 300, y: 220 },
            data: {
              title: `${cat.title} Core Techniques`,
              description: `Transition into intermediate strategies, tools, and paradigms needed for production work.`,
              duration: "4 weeks",
              difficulty: "intermediate",
              resourceCount: 5,
              resources: createMockResources(`${cat.title} Core`, "intermediate"),
              status: "not_started",
            },
          },
          {
            id: `${cat.id}-node-3`,
            type: "roadmapNode",
            position: { x: 300, y: 390 },
            data: {
              title: `Advanced ${cat.title} Paradigms`,
              description: `Scale your operations, optimize metrics, design large system integrations, and solve advanced issues.`,
              duration: "3 weeks",
              difficulty: "advanced",
              resourceCount: 5,
              resources: createMockResources(`Advanced ${cat.title}`, "advanced"),
              status: "not_started",
            },
          },
        ],
        edges: [
          { id: `e-${cat.id}-1`, source: `${cat.id}-node-1`, target: `${cat.id}-node-2` },
          { id: `e-${cat.id}-2`, source: `${cat.id}-node-2`, target: `${cat.id}-node-3`, animated: true },
        ],
      };
    }
  });
};

populateFallbackRoadmaps();

// ─── Mock Achievements ─────────────────────────────────────────────────────────
const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-beginner",
    title: "Beginner Explorer",
    description: "Mark your very first topic/node as Completed.",
    status: "locked",
    iconName: "Compass",
    xpValue: 100,
  },
  {
    id: "ach-explorer",
    title: "Category Diver",
    description: "Visit nodes in at least two different categories.",
    status: "locked",
    iconName: "Globe",
    xpValue: 250,
  },
  {
    id: "ach-consistent",
    title: "Consistent Learner",
    description: "Maintain a learning streak of 3 consecutive days.",
    status: "locked",
    iconName: "Flame",
    xpValue: 500,
  },
  {
    id: "ach-master",
    title: "Pathfinder Master",
    description: "Fully complete all nodes in any roadmap path.",
    status: "locked",
    iconName: "Trophy",
    xpValue: 1000,
  },
];

// Default Progress State for fresh users
const DEFAULT_USER_PROGRESS: UserProgress = {
  completedNodes: [],
  bookmarkedNodes: [],
  favorites: [],
  xpPoints: 0,
  learningStreak: 1,
  lastVisitedNode: null,
  activeRoadmaps: {},
};

// Helper to calculate progress percentage for a roadmap
const calculateRoadmapProgress = (roadmapId: string, completedNodes: string[]): number => {
  const roadmap = MOCK_ROADMAPS[roadmapId];
  if (!roadmap) return 0;
  const roadmapNodeIds = roadmap.nodes.map((n) => n.id);
  const completedRoadmapNodes = roadmapNodeIds.filter((id) => completedNodes.includes(id));
  return Math.round((completedRoadmapNodes.length / roadmapNodeIds.length) * 100);
};

// Helper to update active roadmaps progress maps
const updateActiveRoadmapsProgress = (completedNodes: string[]): Record<string, number> => {
  const activeRoadmaps: Record<string, number> = {};
  Object.keys(MOCK_ROADMAPS).forEach((rid) => {
    const percent = calculateRoadmapProgress(rid, completedNodes);
    if (percent > 0) {
      activeRoadmaps[rid] = percent;
    }
  });
  return activeRoadmaps;
};

// Helper to check and unlock achievements based on progress state
const checkAchievements = (progress: UserProgress): Achievement[] => {
  const achievements = [...ALL_ACHIEVEMENTS];
  
  // ach-beginner: at least 1 completed node
  if (progress.completedNodes.length >= 1) {
    const ach = achievements.find((a) => a.id === "ach-beginner");
    if (ach && ach.status === "locked") {
      ach.status = "unlocked";
      ach.unlockedAt = new Date().toISOString();
      progress.xpPoints += ach.xpValue;
    }
  }

  // ach-explorer: nodes completed across multiple categories
  const categoriesWithCompletion = new Set<string>();
  progress.completedNodes.forEach((nodeId) => {
    // Find which roadmap this node belongs to
    Object.entries(MOCK_ROADMAPS).forEach(([rid, rm]) => {
      if (rm.nodes.some((n) => n.id === nodeId)) {
        categoriesWithCompletion.add(rid);
      }
    });
  });
  if (categoriesWithCompletion.size >= 2) {
    const ach = achievements.find((a) => a.id === "ach-explorer");
    if (ach && ach.status === "locked") {
      ach.status = "unlocked";
      ach.unlockedAt = new Date().toISOString();
      progress.xpPoints += ach.xpValue;
    }
  }

  // ach-consistent: streak >= 3
  if (progress.learningStreak >= 3) {
    const ach = achievements.find((a) => a.id === "ach-consistent");
    if (ach && ach.status === "locked") {
      ach.status = "unlocked";
      ach.unlockedAt = new Date().toISOString();
      progress.xpPoints += ach.xpValue;
    }
  }

  // ach-master: at least one active roadmap at 100%
  const hasFinishedRoadmap = Object.values(progress.activeRoadmaps).some((pct) => pct === 100);
  if (hasFinishedRoadmap) {
    const ach = achievements.find((a) => a.id === "ach-master");
    if (ach && ach.status === "locked") {
      ach.status = "unlocked";
      ach.unlockedAt = new Date().toISOString();
      progress.xpPoints += ach.xpValue;
    }
  }

  return achievements;
};

// ─── Server Functions (BFF Actions) ──────────────────────────────────────────

/**
 * Fetches the overview list of categories and user progress summaries.
 */
export const fetchRoadmapsList = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context: _context }): Promise<{ categories: RoadmapCategory[]; achievements: Achievement[]; progress: UserProgress }> => {
    // BFF middleware session hook (session context available from context.session if needed)
    
    // Stub progress for response. In a real DB, it would read from Supabase.
    // If not authenticated, we return default placeholders which the client hook will override with LocalStorage.
    const progress = DEFAULT_USER_PROGRESS;
    const achievements = ALL_ACHIEVEMENTS;

    return {
      categories: MOCK_CATEGORIES,
      achievements,
      progress,
    };
  });

/**
 * Fetches specific Roadmap nodes and edges.
 */
export const fetchRoadmapDetail = createServerFn({ method: "GET" })
  .validator((d: string) => d) // validates search ID
  .handler(async ({ data: roadmapId }): Promise<Roadmap | null> => {
    const roadmap = MOCK_ROADMAPS[roadmapId];
    if (!roadmap) return null;
    return roadmap;
  });

/**
 * Performs Server-side XP calculation, Streak tracking, and Achievements validation.
 * Crucial BFF design: Business logic (scoring, streak calculations) resides on the server.
 */
export const updateNodeProgress = createServerFn({ method: "POST" })
  .validator((data: { nodeId: string; roadmapId: string; status: "completed" | "in_progress" | "not_started"; currentProgress: UserProgress }) => data)
  .handler(async ({ data }): Promise<{ progress: UserProgress; achievements: Achievement[]; newUnlock: boolean }> => {
    const { nodeId, roadmapId, status, currentProgress } = data;
    
    // Immer-like logic applied on the server (functional updates)
    const nextProgress = {
      ...currentProgress,
      completedNodes: [...currentProgress.completedNodes],
    };

    let xpDelta = 0;
    
    // Find node difficulty for XP delta
    let nodeDifficulty: NodeDifficulty = "beginner";
    const roadmap = MOCK_ROADMAPS[roadmapId];
    if (roadmap) {
      const node = roadmap.nodes.find((n) => n.id === nodeId);
      if (node) {
        nodeDifficulty = node.data.difficulty;
      }
    }

    const wasCompleted = nextProgress.completedNodes.includes(nodeId);
    
    if (status === "completed" && !wasCompleted) {
      nextProgress.completedNodes.push(nodeId);
      nextProgress.lastVisitedNode = nodeId;
      
      // Calculate XP addition
      if (nodeDifficulty === "beginner") xpDelta = 10;
      else if (nodeDifficulty === "intermediate") xpDelta = 25;
      else if (nodeDifficulty === "advanced") xpDelta = 50;
      
      nextProgress.xpPoints += xpDelta;
    } else if (status !== "completed" && wasCompleted) {
      nextProgress.completedNodes = nextProgress.completedNodes.filter((id) => id !== nodeId);
      
      // Deduct XP
      if (nodeDifficulty === "beginner") xpDelta = -10;
      else if (nodeDifficulty === "intermediate") xpDelta = -25;
      else if (nodeDifficulty === "advanced") xpDelta = -50;
      
      nextProgress.xpPoints = Math.max(0, nextProgress.xpPoints + xpDelta);
    }

    // Refresh roadmap completion maps
    nextProgress.activeRoadmaps = updateActiveRoadmapsProgress(nextProgress.completedNodes);

    // Calculate streaks logic on server
    // To mock streak incrementing: if user updates progress, verify activity date. 
    // For simplicity of mock, we increment streak if XP increases up to max 10 days.
    if (xpDelta > 0 && Math.random() > 0.7) {
      nextProgress.learningStreak += 1;
    }

    // Evaluate Achievements
    const unlockedBefore = ALL_ACHIEVEMENTS.filter((a) => a.status === "unlocked").map((a) => a.id);
    const achievements = checkAchievements(nextProgress);
    const unlockedAfter = achievements.filter((a) => a.status === "unlocked").map((a) => a.id);
    const newUnlock = unlockedAfter.length > unlockedBefore.length;

    return {
      progress: nextProgress,
      achievements,
      newUnlock,
    };
  });

/**
 * Handles toggling bookmark state on the server.
 */
export const toggleNodeBookmark = createServerFn({ method: "POST" })
  .validator((data: { nodeId: string; currentProgress: UserProgress }) => data)
  .handler(async ({ data }): Promise<{ progress: UserProgress }> => {
    const { nodeId, currentProgress } = data;
    
    const isBookmarked = currentProgress.bookmarkedNodes.includes(nodeId);
    const nextProgress = {
      ...currentProgress,
      bookmarkedNodes: isBookmarked
        ? currentProgress.bookmarkedNodes.filter((id) => id !== nodeId)
        : [...currentProgress.bookmarkedNodes, nodeId],
    };

    return {
      progress: nextProgress,
    };
  });

/**
 * Handles toggling roadmap favorite state on the server.
 */
export const toggleRoadmapFavorite = createServerFn({ method: "POST" })
  .validator((data: { roadmapId: string; currentProgress: UserProgress }) => data)
  .handler(async ({ data }): Promise<{ progress: UserProgress }> => {
    const { roadmapId, currentProgress } = data;
    
    const isFavorite = currentProgress.favorites?.includes(roadmapId) ?? false;
    const nextProgress = {
      ...currentProgress,
      favorites: isFavorite
        ? (currentProgress.favorites ?? []).filter((id) => id !== roadmapId)
        : [...(currentProgress.favorites ?? []), roadmapId],
    };

    return {
      progress: nextProgress,
    };
  });

